/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import type { Socket } from 'socket.io';
import { ISettings } from 'global';
import Channel from './channel';
import TableManager from '../../tableManager';

export class PlayerSocket {
  private socket: Socket;

  private iPlayerId: string;

  private iBattleId: string;

  private sAuthToken: string;

  private oSetting: ISettings;

  constructor(socket: Socket) {
    this.socket = socket; // - socket = {id: <socketId>, ...other}
    this.iPlayerId = socket.data.iPlayerId;
    this.iBattleId = socket.data.iBattleId;
    this.sAuthToken = socket.data.sAuthToken;
    this.oSetting = socket.data.oSettings;

    this.socket.data = {}; // - clean up socket payload
    this.setEventListeners(); // - register listeners
    log.debug(`${_.now()} client: ${this.iPlayerId} connected with socketId : ${this.socket.id}`);
  }

  private setEventListeners() {
    this.socket.on('reqPing', this.reqPing.bind(this));
    this.socket.on('error', this.errorHandler.bind(this));
    this.socket.on('disconnect', this.disconnect.bind(this));
    this.socket.on('reqJoinTable', this.joinTable.bind(this));
  }

  /**
   * if player is already in the battle, fetch player and table data, and reconnect them to the same battle
   * if player is not in a battle, create new player, table, and set startGameScheduled time
   */
  private async joinTable(_ack: (data: any) => unknown) {
    if (typeof _ack !== 'function') return false;
    try {
      // TODO
      const table = await TableManager.getTable(this.iBattleId);
      if (!table) {
        await TableManager.createTable();
      }
      const player = table?.getPlayer(this.iPlayerId);
      if (!player) table?.addParticipant();
      // TODO : handle reconnection

      if (!this.socket.eventNames().includes(this.iBattleId)) {
        const channel = new Channel(this.iBattleId, this.iPlayerId);
        this.socket.on(this.iBattleId, channel.onEvent.bind(channel));
      } // - add channel listeners and handle duplicate listeners(mainly while reconnection)
      _ack({ iPlayerId: this.iPlayerId, iBattleId: this.iBattleId, oSetting: this.oSetting });
      return true;
    } catch (err: any) {
      log.error(`${_.now()} client: '${this.iPlayerId}' joinTable event failed. reason: ${err.message}`);
      return false;
    }
  }

  private reqPing(body: any, _ack?: () => unknown) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof _ack === 'function') _ack('pong');
    log.verbose(`${_.now()} client: '${this.iPlayerId}' => ping`);
  }

  private async disconnect(reason: string) {
    log.debug(`${_.now()} client: ${this.iPlayerId} disconnected with socketId : ${this.socket.id}. reason: ${reason}`);
    try {
      if (reason === 'server namespace disconnect') return;
      // TODO : handle reconnection
    } catch (err: any) {
      log.debug(`${_.now()} client: '${this.iPlayerId}' disconnect event failed. reason: ${err.message}`);
    }
  }

  private errorHandler(err: Error) {
    log.error(`${_.now()} socket error: ${err.message}`);
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
