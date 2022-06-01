/* eslint-disable import/no-cycle */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IPlayer, ITable, RedisJSON } from '../../types/global';
import { Deck } from '../util';
import Player from './player';
import Table from './table';

class TableManager {
  constructor() {
    emitter.on('sch', this.onScheduledEvents.bind(this));
    emitter.on('redisEvent', this.onScheduledEvents.bind(this));
  }

  async onScheduledEvents(body: { sTaskName: string; iBattleId: string; iPlayerId?: string; [key: string]: any }, callback: () => Promise<void>) {
    const { sTaskName, iBattleId, iPlayerId, ...oData } = body;
    try {
      if (!sTaskName) throw new Error('empty sTaskName');
      if (!iBattleId) throw new Error('empty iBattleId');
      await this.executeScheduledTask(sTaskName, iBattleId, iPlayerId ?? '', oData, callback);
    } catch (error: any) {
      log.debug(`Error Occurred on TableManager.onScheduledEvents(). sTaskName : ${sTaskName}. reason :${error.message}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async executeScheduledTask(sTaskName: string, iBattleId: string, iPlayerId: string, oData: { [key: string]: any }, callback: () => Promise<void>) {
    log.verbose(`${_.now()} executeScheduledTask ${sTaskName}`);
    if (!sTaskName) return false;
    const oTable = await TableManager.getTable(iBattleId);
    if (!oTable) return false;
    switch (sTaskName) {
      case 'distributeCard':
        await oTable.distributeCard(oTable);
        return true;
      case 'drawCard':
        return true;
      default:
        return false;
    }
  }

  public static async createTable(oData: { iBattleId: ITable['iBattleId']; oSettings: ITable['oSettings'] }) {
    try {
      const oTableWithParticipant: ITable = {
        iBattleId: oData.iBattleId,
        iPlayerTurn: '',
        iSkippedPLayer: '',
        aPlayerId: [],
        aDrawPile: new Deck().getDeck(),
        aDiscardPile: [],
        bToSkip: false,
        eState: 'waiting',
        eTurnDirection: 'clockwise',
        eNextCardColor: '',
        nDrawCount: 0,
        oSettings: oData.oSettings,
        dCreatedAt: new Date(),
      };
      const sRedisSetResponse = await redis.client.json.SET(_.getTableKey(oTableWithParticipant.iBattleId), '.', oTableWithParticipant as unknown as RedisJSON);
      if (!sRedisSetResponse) return null;
      return new Table(oTableWithParticipant);
    } catch (err: any) {
      log.error(`Error Occurred on TableManager,createTable(). reason :${err.message}`);
      log.silly(oData);
      return null;
    }
  }

  public static async createPlayer(oPlayer: IPlayer) {
    try {
      const sRedisSetResponse = await redis.client.json.SET(_.getPlayerKey(oPlayer.iBattleId, oPlayer.iPlayerId), '.', oPlayer as unknown as RedisJSON);
      if (!sRedisSetResponse) return null;
      return new Player(oPlayer);
    } catch (err: any) {
      log.error(`Error Occurred on TableManager.createPlayer(). reason :${err.message}`);
      log.silly(oPlayer);
      return null;
    }
  }

  public static async getTable(iBattleId: string) {
    try {
      const oTableData = (await redis.client.json.GET(_.getTableKey(iBattleId))) as unknown as ITable | null;
      if (!oTableData) return null;

      const aPromise: Array<Promise<unknown>> = []; // - To add participant in table
      oTableData.aPlayerId.forEach(iPlayerId => aPromise.push(redis.client.json.GET(_.getPlayerKey(iBattleId, iPlayerId))));

      const aPlayer = (await Promise.all(aPromise)) as unknown as Array<IPlayer | null>;
      if (aPlayer.some(p => !p)) log.error('error');

      const aPlayerClassified = aPlayer.map(p => (p ? new Player(p) : null));

      return new Table({ ...oTableData, aPlayer: aPlayerClassified.filter(p => p) as unknown as Array<Player> });
    } catch (err: any) {
      log.error(`Error Occurred on TableManager.getTable(). reason :${err.message}`);
      log.silly(`iBattleId : ${iBattleId}`);
      return null;
    }
  }

  public static async getPlayer(iBattleId: string, iPlayerId: string) {
    try {
      const oPlayerData = (await redis.client.json.GET(_.getPlayerKey(iBattleId, iPlayerId))) as unknown as IPlayer | null;
      if (!oPlayerData) return null;
      return new Player(oPlayerData);
    } catch (err: any) {
      log.error(`Error Occurred on TableManager.getPlayer(). reason :${err.message}`);
      log.silly(`iBattleId : ${iBattleId} iPlayerId : ${iPlayerId}`);
      return null;
    }
  }
}

export default TableManager;
