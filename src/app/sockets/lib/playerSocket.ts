import type { Socket } from 'socket.io';
import Channel from './channel';
import { response } from '../../util';
import TableManager from '../../tableManager';
import { ICallback, ISettings } from '../../../types/global';

class PlayerSocket {
  private socket: Socket;

  private iPlayerId: string;

  private iBattleId: string;

  private sPlayerName: string;

  private sAuthToken: string;

  private oSetting: ISettings; // We are fetching from rpc.

  private iLobbyId: string;

  private isReconnect: boolean;

  private nTablePlayer: number;

  private nMinTablePlayer: number;

  private isNewMatchMakingFlowEnabled: boolean;

  constructor(socket: Socket) {
    this.socket = socket; // - socket = {id: <socketId>, ...other}
    this.iPlayerId = socket.data.iPlayerId;
    this.iBattleId = !socket.data.isNewMatchMakingFlowEnabled ? socket.data.iBattleId : '';
    this.nTablePlayer = !socket.data.isNewMatchMakingFlowEnabled ? socket.data.nTablePlayer : 0;
    this.iLobbyId = socket.data.iLobbyId;
    this.isReconnect = socket.data.isReconnect;
    this.sPlayerName = socket.data.sPlayerName;
    this.sAuthToken = socket.data.sAuthToken;
    this.nMinTablePlayer = socket.data.nMinTablePlayer;
    this.oSetting = socket.data.oSettings;
    this.isNewMatchMakingFlowEnabled = socket.data.isNewMatchMakingFlowEnabled;
    if (this.isNewMatchMakingFlowEnabled) {
      this.iBattleId = socket.data.iBattleId;
      this.nTablePlayer = socket.data.nTablePlayer;
    }

    this.socket.data = {}; // - clean up socket payload
    this.setEventListeners(); // - register listeners
    log.debug(`${_.now()} client: ${this.iPlayerId} connected with socketId : ${this.socket.id}`);
  }

  private setEventListeners() {
    this.socket.on('reqPing', this.reqPing.bind(this));
    this.socket.on('reqTableJoin', this.joinTable.bind(this));
    this.socket.on('error', this.errorHandler.bind(this));
    this.socket.on('disconnect', this.disconnect.bind(this));
  }

  /**
   * if player is already in the battle, fetch player and table data, and reconnect them to the same battle
   * if player is not in a battle, create new player, table, and set startGameScheduled time
   * when all player joined emit 'resTableState'
   */
  private async joinTable(body: { i_battle_id: string; nTablePlayer: number }, _ack: ICallback) {
    if (typeof _ack !== 'function') return false;
    try {
      // TODO :- need to manage empty battle id table creation.
      this.iBattleId = body.i_battle_id;
      this.nTablePlayer = body.nTablePlayer;
      const debugBody = _.parse(body);
      log.debug(`body.i_battle_id --> ${debugBody}`);
      log.debug(`debugBody--> ${debugBody.i_battle_id}`);
      log.debug(`6. joinTable started: pid -> ${this.iPlayerId} BId --> ${this.iBattleId}`);
      let oTable = await TableManager.getTable(body.i_battle_id);
      log.verbose(`oTable --> ${_.stringify(oTable)}`);
      console.log('this.isReconnect --> ', this.isReconnect);
      log.debug(`body in joinTable --> ${body}`);
      // log.debug(`body in joinTable --> ${_.stringify(body)}`);
      if (!oTable && this.isReconnect) return _ack({ oData: {}, status: response.TABLE_NOT_FOUND });
      if (!oTable) {
        log.verbose(`Creating table in table Join`);
        oTable = await TableManager.createTable({
          iBattleId: this.iBattleId,
          oSettings: this.oSetting,
          iPlayerId: this.iPlayerId,
          iLobbyId: this.iLobbyId,
          nTablePlayer: this.nTablePlayer,
          nMinTablePlayer: this.nMinTablePlayer,
        });
      }
      if (!oTable) throw new Error('Table not created');
      let oPlayer = oTable.getPlayer(this.iPlayerId);
      log.verbose(`oPlayer --> ${_.stringify(oPlayer)}`);
      if (!oPlayer || oPlayer === null) {
        oPlayer = await TableManager.createPlayer({
          iPlayerId: this.iPlayerId,
          iBattleId: this.iBattleId,
          sPlayerName: this.sPlayerName,
          sSocketId: this.socket.id,
          nSeat: oTable.toJSON().aPlayer.length,
          nScore: 0,
          nGraceTime: oTable.toJSON().oSettings.nGraceTime,
          nMissedTurn: 0,
          nDrawNormal: 0,
          nReconnectionAttempt: 0,
          nStartHandSum: 0,
          nUsedNormalCard: 0,
          nUsedActionCard: 0,
          nUsedSpecialCard: 0,
          nDrawnNormalCard: 0,
          nDrawnSpecialCard: 0,
          nSkipUsed: 0,
          nReverseUsed: 0,
          nDraw2Used: 0,
          nDraw4Used: 0,
          nWildUsed: 0,
          nUnoPressed: 0,
          nUnoMissed: 0,
          nSkipped: 0,
          nDrawn2: 0,
          nDrawn4: 0,
          nOptionalDraw: 0,
          bSpecialMeterFull: false,
          bNextTurnSkip: false,
          bUnoDeclared: false,
          bSkipSpecialMeterProcess: false,
          aHand: [],
          aTurnData: [],
          aDrawnCards: [''],
          eState: 'waiting',
          dCreatedAt: new Date(),
          sStartingHand: '',
        }); // - since player joining for the first time.
        if (!oPlayer) throw new Error('Player not created');
        _ack({ oData: { iBattleId: this.iBattleId, iPlayerId: this.iPlayerId }, status: response.SUCCESS });
        if (!(await oTable.addPlayer(oPlayer))) throw new Error('Player not added to table');
      } else {
        log.verbose(`else called`);
        _ack({ oData: { iBattleId: this.iBattleId, iPlayerId: this.iPlayerId }, status: response.SUCCESS });
        await oPlayer.reconnect(this.socket.id, oTable);
      }

      if (!this.socket.eventNames().includes(this.iBattleId)) {
        const channel = new Channel(this.iBattleId, this.iPlayerId);
        this.socket.on(this.iBattleId, channel.onEvent.bind(channel));
      } // - add channel listeners and handle duplicate listeners(mainly while reconnection)

      return true;
    } catch (err: any) {
      log.error(`${_.now()} client: '${this.iPlayerId}' joinTable event failed. reason: ${err.message}`);
      _ack({ oData: { iBattleId: this.iBattleId, iPlayerId: this.iPlayerId }, status: response.SERVER_ERROR });
      return false;
    }
  }

  private reqPing(body: any, _ack?: ICallback) {
    // if (typeof _ack === 'function') _ack('pong');
    if (typeof _ack === 'function') _ack({ sTaskName: 'resPong' });
    log.verbose(`${_.now()} client: '${this.iPlayerId}' => ping`);
  }

  private async disconnect(reason: string) {
    log.debug(`${_.now()} client: ${this.iPlayerId} disconnected with socketId : ${this.socket.id}. reason: ${reason}`);
    try {
      if (reason === 'server namespace disconnect') return;
      const table = await TableManager.getTable(this.iBattleId);
      const player = await table?.getPlayer(this.iPlayerId);
      if (!player) return;

      if (player.eState !== 'left') await player.update({ eState: 'disconnected' });
      table?.emit('playerDisconnected', { iPlayerId: this.iPlayerId });
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
      isReconnect: this.isReconnect,
      sAuthToken: this.sAuthToken,
      oSetting: this.oSetting,
    };
  }
}

export default PlayerSocket;
