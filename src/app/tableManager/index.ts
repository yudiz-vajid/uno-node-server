/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import { IPlayer, ISettings, ITable } from 'global';
import Player from './player';
import Table from './table';

// eslint-disable-next-line import/prefer-default-export
class TableManager {
  defaultTableSettings: ISettings;

  static defaultTableSettings: ISettings;

  constructor() {
    this.defaultTableSettings = {
      bMustCollectOnMissTurn: true,
      nUnoTime: null,
      nTurnMissLimit: null,
      nGraceTime: null,
      nTurnTime: null,
      nStartGameTime: null,
      aCardScore: [],
    };
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
    console.log('getTable called...');
    const oTableData: any = await redis.client.json.GET(_.getTableKey(iBattleId));
    if (!oTableData) return null;

    const aPromise: any[] = []; // To add participant in table
    console.log('oTableData.aPlayerIds :: ', oTableData);
    //
    for (const iPlayerId of oTableData.aPlayerIds) {
      console.log('iPlayerId :: ', iPlayerId);
      // eslint-disable-next-line no-await-in-loop
      console.log(await redis.client.json.get(_.getPlayerKey(iBattleId, iPlayerId)));
      aPromise.push(redis.client.json.get(_.getPlayerKey(iBattleId, iPlayerId)));
    }
    const aParticipant = await Promise.all(aPromise);
    if (aParticipant.some(predicate => predicate === null)) log.error('error');

    oTableData.aParticipant = aParticipant;
    return new Table(oTableData);
  }

  public static async createTable(oData: any) {
    const tableData: any = {
      iBattleId: oData.iBattleId,
      iPlayerTurn: '',
      iSkippedPLayer: '',
      aPlayerIds: [],
      aDrawPile: [],
      bToSkip: false,
      eState: 'waiting',
      eTurnDirection: 'clockwise',
      eNextCardColor: '',
      nDrawCount: null,
      dCreatedDate: new Date(),
      oSettings: { ...oData.oSettings },
      aParticipant: [],
    };
    const oTableData: any = await redis.client.json.set(_.getTableKey(tableData.iBattleId), '.', tableData);
    if (!oTableData) return null;
    return new Table(tableData);
  }

  public static async createPlayer(oPlayer: any) {
    try {
      // console.log('createPlayer called...', oPlayer);
      const oTableData: any = await redis.client.json.set(_.getPlayerKey(oPlayer.iBattleId, oPlayer.iPlayerId), '.', oPlayer);
      if (!oTableData) return null;
      return new Player(oTableData);
    } catch (err: any) {
      return undefined;
    }
  }

  public static async getPlayer(iBattleId: string, iPlayerId: string) {
    const oPlayerData: any = await redis.client.json.get(_.getPlayerKey(iBattleId, iPlayerId));
    if (!oPlayerData) return null;
    return new Player(oPlayerData);
  }
}

export default TableManager;
