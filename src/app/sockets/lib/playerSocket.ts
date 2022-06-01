/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import type { Socket } from 'socket.io';
import Channel from './channel';
import { ISettings } from '../../../types/global';
import TableManager from '../../tableManager';
import { response } from '../../util';

class PlayerSocket {
  private socket: Socket;

  private iPlayerId: string;

  private iBattleId: string;

  private sPlayerName: string;

  private sAuthToken: string;

  private oSetting: ISettings; // TODO : remove since need to be fetched from gRPC service

  constructor(socket: Socket) {
    this.socket = socket; // - socket = {id: <socketId>, ...other}
    this.iPlayerId = socket.data.iPlayerId;
    this.iBattleId = socket.data.iBattleId;
    this.sPlayerName = socket.data.sPlayerName;
    this.sAuthToken = socket.data.sAuthToken;
    this.oSetting = socket.data.oSettings;

    this.socket.data = {}; // - clean up socket payload
    this.setEventListeners(); // - register listeners
    log.debug(`${_.now()} client: ${this.iPlayerId} connected with socketId : ${this.socket.id}`);
  }

  private setEventListeners() {
    this.socket.on('reqPing', this.reqPing.bind(this));
    this.socket.on('reqTableJoin', this.joinTable.bind(this));
    this.socket.on('error', this.errorHandler.bind(this));
    this.socket.on('disconnect', this.disconnect.bind(this));
    // this.joinTable();
  }

  /**
   * if player is already in the battle, fetch player and table data, and reconnect them to the same battle
   * if player is not in a battle, create new player, table, and set startGameScheduled time
   * when all player joined emit 'resTableState'
   */
  private async joinTable(body: unknown, _ack: (data: unknown) => void) {
    if (typeof _ack !== 'function') return false;
    try {
      let table = await TableManager.getTable(this.iBattleId);
      if (!table) table = await TableManager.createTable({ iBattleId: this.iBattleId, oSettings: this.oSetting });
      if (!table) throw new Error('Table not created');

      let player = await table.getPlayer(this.iPlayerId);
      if (!player) {
        player = await TableManager.createPlayer({
          iPlayerId: this.iPlayerId,
          iBattleId: this.iBattleId,
          sPlayerName: this.sPlayerName,
          sSocketId: this.socket.id,
          nSeat: table.toJSON().aPlayer.length,
          nScore: 0,
          nUnoTime: table.toJSON().oSettings.nUnoTime,
          nGraceTime: table.toJSON().oSettings.nGraceTime,
          nMissedTurn: 0,
          nDrawNormal: 0,
          nReconnectionAttempt: 0,
          bSpecialMeterFull: false,
          aHand: [],
          eState: 'waiting',
          dCreatedAt: new Date(),
        }); // - since player joining for the first time.
        if (!player) throw new Error('Player not created');
        if (!(await table.addPlayer(player))) throw new Error('Player not added to table');
      } else await player.reconnect(this.socket.id, table.toJSON().eState);

      if (!this.socket.eventNames().includes(this.iBattleId)) {
        const channel = new Channel(this.iBattleId, this.iPlayerId);
        this.socket.on(this.iBattleId, channel.onEvent.bind(channel));
      } // - add channel listeners and handle duplicate listeners(mainly while reconnection)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { aDrawPile, aPlayer, aPlayerId, ...rest } = table.toJSON();
      const aParticipant: Array<Record<'iPlayerId' | 'nSeat' | 'nCardCount', string | number>> = [];
      table.toJSON().aPlayer.forEach(player => {
        const p = player.toJSON();
        aParticipant.push({ iPlayerId: p.iPlayerId, nSeat: p.nSeat, nCardCount: p.aHand.length });
      });

      _ack({ iBattleId: this.iBattleId, iPlayerId: this.iPlayerId, success: response.SUCCESS });
      table.emit('resTableJoin', { iBattleId: this.iBattleId, iPlayerId: this.iPlayerId });
      if (table.toJSON().aPlayerId.length == (this.oSetting.nTotalPlayerCount ?? 2)) {
        table.emit('resTableState', { table: rest, aPlayer: aParticipant });
      }
      return true;
    } catch (err: any) {
      log.error(`${_.now()} client: '${this.iPlayerId}' joinTable event failed. reason: ${err.message}`);
      return false;
    }
  }

  private reqPing(body: any, _ack?: (data: unknown) => void) {
    if (typeof _ack === 'function') _ack('pong');
    log.verbose(`${_.now()} client: '${this.iPlayerId}' => ping`);
  }

  private async disconnect(reason: string) {
    log.debug(`${_.now()} client: ${this.iPlayerId} disconnected with socketId : ${this.socket.id}. reason: ${reason}`);
    try {
      if (reason === 'server namespace disconnect') return;
      const table = await TableManager.getTable(this.iBattleId);
      const player = await table?.getPlayer(this.iPlayerId);
      if (!player) return;

      await player.update({ eState: 'disconnected' });
      table?.emit('playerDisconnected', { iPlayerId: this.iPlayerId });
      // TODO : remove table and player if no participant is left
    } catch (err: any) {
      log.debug(`${_.now()} client: '${this.iPlayerId}' disconnect event failed. reason: ${err.message}`);
    }
  }

  private errorHandler(err: Error) {
    log.error(`${_.now()} socket error. iPlayerId: ${this.iPlayerId}, iBattleId: ${this.iBattleId}. reason: ${err.message}`);
  }

  public toJSON() {
    return {
      socket: this.socket,
      iPlayerId: this.iPlayerId,
      iBattleId: this.iBattleId,
      sAuthToken: this.sAuthToken,
      oSetting: this.oSetting,
    };
  }
}

export default PlayerSocket;
