/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ICallback, ICard, IPlayer, ISettings, ITable, RedisJSON } from '../../types/global';
import { Deck, response } from '../util';
import Player from './player';
import Table from './table';
import rpc from '../../pathFinder/service/rpc';

class TableManager {
  constructor() {
    emitter.on('sch', this.onScheduledEvents.bind(this));
    emitter.on('redisEvent', this.onScheduledEvents.bind(this));
    emitter.on('channelEvent', this.onScheduledEvents.bind(this));
  }

  async onScheduledEvents(body: { sTaskName: string; iBattleId: string; iPlayerId: string; oData: Record<string, unknown> }, callback: () => Promise<void>) {
    const { sTaskName, iBattleId, iPlayerId, oData } = body;
    try {
      if (!sTaskName) throw new Error('empty sTaskName');
      if (!iBattleId) throw new Error('empty iBattleId');
      await this.executeScheduledTask(sTaskName, iBattleId, iPlayerId ?? '', oData, callback);
    } catch (error: any) {
      log.debug(`${_.now()} Error Occurred on TableManager.onScheduledEvents(). sTaskName : ${sTaskName}. reason :${error.message}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async executeScheduledTask(sTaskName: string, iBattleId: string, iPlayerId: string, oData: Record<string, unknown>, callback: ICallback) {
    // log.verbose(`${_.now()} executeScheduledTask ${sTaskName}`);
    if (!sTaskName) return false;

    const oTable = await TableManager.getTable(iBattleId);
    if (!oTable) return false;

    const oPlayer = oTable.getPlayer(iPlayerId);

    if (['assignTurnTimerExpired', 'assignGraceTimerExpired', 'drawCard', 'discardCard', 'declareUno'].includes(sTaskName)) {
      if (!oPlayer) {
        callback({ oData: {}, status: response.PLAYER_NOT_FOUND });
        return (log.warn(`${_.now()} oPlayer not found in table. { iBattleId : ${iBattleId}, iPlayerId : ${iPlayerId} }`) && null) ?? false;
      }
      if (oTable.toJSON().eState !== 'running' && ['drawCard', 'discardCard'].includes(sTaskName)) {
        callback({ oData: {}, status: response.TABLE_NOT_RUNNING });
        return (log.warn(`${_.now()} Table is not in running state. { iBattleId : ${iBattleId}, eState : ${oTable.toJSON().eState} }`) && null) ?? false;
      }
      if (!oTable.hasValidTurn(iPlayerId) && ['drawCard', 'discardCard'].includes(sTaskName)) {
        callback({ oData: {}, status: response.NOT_YOUR_TURN });
        return (log.silly(`${_.now()} ${iPlayerId} has not valid turn.`) && null) ?? false;
      }
    }

    switch (sTaskName) {
      case 'distributeCard':
        await oTable.distributeCard();
        return true;

      case 'masterTimerExpired':
        oTable.masterTimerExpired();
        return true;

      case 'masterTimerWillExpire':
        oTable.masterTimerWillExpire();
        return true;

      case 'gameInitializeTimerExpired':
        oTable.gameInitializeTimerExpired();
        return true;

      case 'assignTurnTimerExpired':
        oPlayer?.assignTurnTimerExpired(oTable);
        return true;

      case 'assignGraceTimerExpired':
        oPlayer?.assignGraceTimerExpired(oTable);
        return true;

      case 'assignWildCardColorTimerExpired':
        oPlayer?.assignWildCardColorTimerExpired(oTable);
        return true;

      case 'drawCard':
        oPlayer?.drawCard({}, oTable, callback);
        return true;

      case 'keepCard':
        oPlayer?.keepCard({}, oTable, callback);
        return true;

      case 'setWildCardColor':
        oPlayer?.setWildCardColor(oData, oTable, callback);
        return true;

      case 'declareUno':
        oPlayer?.declareUno(oData, oTable, callback);
        return true;

      case 'leaveMatch':
        oPlayer?.leaveMatch(oData, oTable, callback);
        return true;

      case 'discardCard':
        oPlayer?.discardCard(oData as { iCardId: string; eColor?: Omit<ICard['eColor'], 'black'> }, oTable, callback);
        return true;

      default:
        return false;
    }
  }

  /*
  gameConfig: {
      nTurnTime: 30,
      aCardScore: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 20, 20, 50, 50],
      nGraceTime: 30,
      nFastTimerAt: 30,
      nTotalGameTime: false,
      nTotalPlayerCount: 2,
      bStackingDrawCards: true,
      nGameInitializeTime: 5,
      nTotalSkipTurnCount: 3,
      nWildCardColorTimer: 5,
      bMustCollectOnMissTurn: true,
      nSpecialMeterFillCount: 2,
      nStartingActionCardCount: 0,
      nStartingNormalCardCount: 4,
      nStartingSpecialCardCount: 3,
      bDisallowPlayOnDrawCardPenalty: true,
      GameId: 1002056,
      LobbyId: 6207703,
      MaxBonusPercentage: 0.0,
  },
*/
  public static async createTable(oData: { iBattleId: ITable['iBattleId']; oSettings: ITable['oSettings']; iPlayerId: IPlayer['iPlayerId']; iLobbyId: string }) {
    try {
      const oLobbyDataRes = await rpc.getLobbyById(Number(oData.iLobbyId), Number(oData.iPlayerId));
      log.debug(`gRPC oLobbyDataRes on create table :: ${oLobbyDataRes}`);
      if (!oLobbyDataRes) throw new Error('Lobby data not found');
      if (oLobbyDataRes.error) throw new Error('Error on rpc call getLobbyById');

      const { gameConfig } = _.parse(oLobbyDataRes);
      log.verbose(`gameConfig after parsing :: ${gameConfig}`);
      const oTableWithParticipant: ITable = {
        iBattleId: oData.iBattleId,
        iLobbyId: oData.iLobbyId,
        iPlayerTurn: '',
        iSkippedPLayer: '',
        iDrawPenltyPlayerId: '',
        aPlayerId: [],
        aDrawPile: new Deck(oData.oSettings.aCardScore).getDeck(),
        aDiscardPile: [],
        bToSkip: false,
        eState: 'waiting',
        bTurnClockwise: true,
        bIsReverseNow: false,
        eNextCardColor: '',
        nDrawCount: 0,
        // @ts-ignore
        oSettings: gameConfig as ISettings, // oData.oSettings,
        dCreatedAt: new Date(),
        oWinningCard: {},
      };
      const sRedisSetResponse = await redis.client.json.SET(_.getTableKey(oTableWithParticipant.iBattleId), '.', oTableWithParticipant as unknown as RedisJSON);
      if (!sRedisSetResponse) return null;
      return new Table(oTableWithParticipant);
    } catch (err: any) {
      log.error(`${_.now()} Error Occurred on TableManager,createTable(). reason :${err.message}`);
      log.silly(`${_.now()} oData: ${oData}`);
      return null;
    }
  }

  public static async createPlayer(oPlayer: IPlayer) {
    try {
      const sRedisSetResponse = await redis.client.json.SET(_.getPlayerKey(oPlayer.iBattleId, oPlayer.iPlayerId), '.', oPlayer as unknown as RedisJSON);
      if (!sRedisSetResponse) return null;
      return new Player(oPlayer);
    } catch (err: any) {
      log.error(`${_.now()} Error Occurred on TableManager.createPlayer(). reason :${err.message}`);
      log.silly(`${_.now()} oPlayer: ${oPlayer}`);
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
      log.error(`${_.now()} Error Occurred on TableManager.getTable(). reason :${err.message}`);
      log.silly(`${_.now()} iBattleId : ${iBattleId}`);
      return null;
    }
  }

  // - not needed nas it is already their in table
  // public static async getPlayer(iBattleId: string, iPlayerId: string) {
  //   try {
  //     const oPlayerData = (await redis.client.json.GET(_.getPlayerKey(iBattleId, iPlayerId))) as unknown as IPlayer | null;
  //     if (!oPlayerData) return null;
  //     return new Player(oPlayerData);
  //   } catch (err: any) {
  //     log.error(`${_.now()} Error Occurred on TableManager.getPlayer(). reason :${err.message}`);
  //     log.silly(`${_.now()} iBattleId : ${iBattleId} iPlayerId : ${iPlayerId}`);
  //     return null;
  //   }
  // }
}

export default TableManager;
