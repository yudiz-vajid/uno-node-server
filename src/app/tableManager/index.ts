/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import { ITable } from 'global';
import Player from './player';
import Table from './table';

// eslint-disable-next-line import/prefer-default-export
class TableManager {
  constructor() {
    emitter.on('sch', this.onEvents.bind(this));
    emitter.on('redisEvent', this.onEvents.bind(this));
  }

  async onEvents(body: any, callback: () => Promise<void>) {
    const { taskName, channelId, userId } = body;
    try {
      if (!taskName) throw new Error('empty taskName');
      if (!channelId) throw new Error('empty channelId');
      await this.executeScheduledTask(taskName, channelId, userId, body, callback);
    } catch (error: any) {
      log.debug(`Error Occurred on onEvents. sTaskName : ${taskName}. reason :${error.message}`);
    }
  }

  // prettier-ignore
  async executeScheduledTask(taskName: string, channelId: string, userId: string, body: any, callback: () => Promise<void>) {
    log.verbose(`${_.now()} executeScheduledTask ${taskName}`);
    // TODO : add taskName validation and operations
  }

  public static async getTable(iBattleId: string) {
    const oTableData: any = await redis.client.json.get(_.getTableKey(iBattleId));
    if (!oTableData) return null;

    const aPromise: any[] = [];
    for (const iPlayerId of oTableData.aPlayerIds) aPromise.push(redis.client.json.get(_.getPlayerKey(iBattleId, iPlayerId)));
    const aParticipant = await Promise.all(aPromise);
    if (aParticipant.some(predicate => predicate === null)) log.error('error');

    oTableData.aParticipant = aParticipant;
    return new Table(oTableData);
  }

  public static async createTable(oData: ITable) {
    const tableData: any = {
      IBattleId: oData.iBattleId,
      iPlayerTurn: oData.iPlayerTurn,
      iSkippedPLayer: oData.iSkippedPLayer,
      aPlayerIds: oData.aPlayerIds,
      aDrawPile: oData.aDrawPile,
      bToSkip: oData.bToSkip,
      eState: oData.eState,
      eTurnDirection: oData.eTurnDirection,
      eNextCardColor: oData.eNextCardColor,
      nDrawCount: oData.nDrawCount,
      dCreatedDate: oData.dCreatedDate,
      oSettings: oData.oSettings,
      aParticipant: [],
    };
    const oTableData: any = await redis.client.json.set(_.getTableKey(oData.iBattleId), '.', tableData);
    if (!oTableData) return null;

    return new Table(oTableData);
  }

  public static async getPlayer(iBattleId: string, iPlayerId: string) {
    const oPlayerData: any = await redis.client.json.get(_.getPlayerKey(iBattleId, iPlayerId));
    if (!oPlayerData) return null;
    return new Player(oPlayerData);
  }
}

export default TableManager;
