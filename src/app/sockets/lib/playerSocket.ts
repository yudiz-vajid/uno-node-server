import type { Socket } from 'socket.io';
import Redlock from 'redlock';
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
    // if (this.isNewMatchMakingFlowEnabled) {
    //   this.iBattleId = socket.data.iBattleId;
    //   this.nTablePlayer = socket.data.nTablePlayer;
    // }

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
      const redlock = new Redlock(
        // You should have one client for each independent redis node
        // or cluster.
        [redis.redLock],
        {
          // The expected clock drift; for more details see:
          // http://redis.io/topics/distlock
          driftFactor: 0.01, // multiplied by lock ttl to determine drift time

          // The max number of times Redlock will attempt to lock a resource
          // before erroring.
          retryCount: 10,

          // the time in ms between attempts
          retryDelay: 200, // time in ms

          // the max time in ms randomly added to retries
          // to improve performance under high contention
          // see https://www.awsarchitectureblog.com/2015/03/backoff.html
          retryJitter: 200, // time in ms

          // The minimum remaining time on a lock before an extension is automatically
          // attempted with the `using` API.
          automaticExtensionThreshold: 500, // time in ms
        }
      );
      const debugBody = _.parse(body).oData;
      this.iBattleId = debugBody.i_battle_id;
      this.nTablePlayer = debugBody.nTablePlayer;
      const tableKey = (await redis.client.GET(`${_.getTableKey(debugBody.i_battle_id)}:initiate`)) as unknown as string | null;
      log.debug(`tableKey --> ${_.stringify(tableKey)}`);
      log.debug(`debugBody --> ${_.stringify(debugBody)}`);
      log.debug(`6. joinTable started: pid -> ${this.iPlayerId} BId --> ${this.iBattleId}`);
      let oTable = await TableManager.getTable(debugBody.i_battle_id);
      console.log('this.isReconnect --> ', this.isReconnect);
      // log.debug(`body in joinTable --> ${_.stringify(body)}`);
      if (!oTable && this.isReconnect) return _ack({ oData: {}, status: response.TABLE_NOT_FOUND });
      // const getTableWithDelay = async (i: number) => {
      //   const randomDel = _.randomBetween(1200, 2500);
      //   await _.delay(randomDel);
      //   oTable = await TableManager.getTable(debugBody.i_battle_id);
      //   if (!oTable && i < 5) getTableWithDelay(i + 1);
      // };
      if (!oTable && debugBody.i_battle_id && tableKey) {
        log.verbose(`table key is there but table not found,player'll wait :: tableKey : ${tableKey}`);
        const randomDel = _.randomBetween(1200, 2500);
        await _.delay(randomDel);
        oTable = await TableManager.getTable(debugBody.i_battle_id);
      }
      if (!oTable && debugBody.i_battle_id && !tableKey) {
        const lock = await redlock.acquire([`${_.getTableKey(debugBody.i_battle_id)}:initiate`], 5000);
        // const newTableKey = await redis.client.SET(`${_.getTableKey(debugBody.i_battle_id)}:initiate`, 'present' as string);
        // log.verbose(`new tableKey created --> ${newTableKey}`);
        let newTableKey;
        try {
          newTableKey = await redis.client.SET(`${_.getTableKey(debugBody.i_battle_id)}:initiate`, 'present' as string);
          log.verbose(`new tableKey created with redLock --> ${newTableKey}`);
        } finally {
          // Release the lock.
          await lock.release();
        }
        oTable = await TableManager.createTable({
          iBattleId: debugBody.i_battle_id,
          oSettings: this.oSetting,
          iPlayerId: this.iPlayerId,
          iLobbyId: this.iLobbyId,
          nTablePlayer: this.nTablePlayer,
          nMinTablePlayer: this.nMinTablePlayer,
        });
        if (!oTable) {
          log.verbose(`table not created due to RPC error battleID :: ${debugBody.iBattleId}`);
          _ack({ oData: {}, status: response.TABLE_NOT_CREATED_RPC });
          // await redis.client.del(`${_.getTableKey(debugBody.iBattleId)}:initiate`);
          const keys = await redis.client.KEYS(`t:${debugBody.iBattleId}:*`);
          const tblKeys: any = await redis.client.KEYS(`t:${debugBody.iBattleId}`);
          keys.push(...tblKeys);
          log.verbose('Table removed due to RPC error');
          if (keys.length) await redis.client.del(keys);
          const schedularKey = await redis.sch.KEYS(`sch:${debugBody.iBattleId}:`);
          if (schedularKey.length) await redis.sch.del(schedularKey);
        }
      }
      if (!oTable) throw new Error('Table not created');
      let oPlayer = oTable.getPlayer(this.iPlayerId);
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
          bIsCardTaken: false,
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
        log.verbose(`Player comes for reconnection P-ID ${this.iPlayerId} ,T-ID ${this.iBattleId}`);
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
      // table?.emit('playerDisconnected', { iPlayerId: this.iPlayerId }); // TODO :- Need to uncomment once build is updated from unity.
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
