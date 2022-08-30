/* eslint-disable no-loop-func */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
import type Table from '.';
import type Player from '../player';
import { ICard, ITable, ITableWithPlayer, RedisJSON } from '../../../types/global';
// eslint-disable-next-line no-unused-vars
import rpc from '../../../pathFinder/service/rpc';

class Service {
  protected readonly iBattleId: ITableWithPlayer['iBattleId'];

  protected readonly iLobbyId: ITableWithPlayer['iLobbyId'];

  protected iPlayerTurn: ITableWithPlayer['iPlayerTurn'];

  protected iSkippedPLayer: ITableWithPlayer['iSkippedPLayer'];

  protected iDrawPenltyPlayerId: ITableWithPlayer['iDrawPenltyPlayerId'];

  protected aPlayerId: ITableWithPlayer['aPlayerId'];

  protected aDrawPile: ITableWithPlayer['aDrawPile'];

  protected aDiscardPile: ITableWithPlayer['aDiscardPile'];

  protected bToSkip: ITableWithPlayer['bToSkip'];

  protected iGameId: ITableWithPlayer['iGameId'];

  protected eState: ITableWithPlayer['eState'];

  protected bTurnClockwise: ITableWithPlayer['bTurnClockwise'];

  protected bIsReverseNow: ITableWithPlayer['bIsReverseNow'];

  protected eNextCardColor: ITableWithPlayer['eNextCardColor'];

  protected nDrawCount: ITableWithPlayer['nDrawCount'];

  protected dCreatedAt: ITableWithPlayer['dCreatedAt'];

  protected oSettings: ITableWithPlayer['oSettings'];

  protected sGameName: ITableWithPlayer['sGameName'];

  protected nEntryFee: ITableWithPlayer['nEntryFee'];

  protected aPlayer: Player[];

  protected oWinningCard: ITableWithPlayer['oWinningCard'];

  protected nTablePlayer: ITableWithPlayer['nTablePlayer'];

  protected nMinTablePlayer: ITableWithPlayer['nMinTablePlayer'];

  protected oLobbyData: ITableWithPlayer['oLobbyData'];

  constructor(oData: ITable & { aPlayer?: Player[] }) {
    this.iBattleId = oData.iBattleId;
    this.iGameId = oData.iGameId;
    this.iLobbyId = oData.iLobbyId;
    this.iPlayerTurn = oData.iPlayerTurn;
    this.iSkippedPLayer = oData.iSkippedPLayer;
    this.iDrawPenltyPlayerId = oData.iDrawPenltyPlayerId;
    this.aPlayerId = oData.aPlayerId;
    this.aDrawPile = oData.aDrawPile;
    this.aDiscardPile = oData.aDiscardPile;
    this.bToSkip = oData.bToSkip;
    this.eState = oData.eState;
    this.bTurnClockwise = oData.bTurnClockwise;
    this.bIsReverseNow = oData.bIsReverseNow;
    this.eNextCardColor = oData.eNextCardColor;
    this.nDrawCount = oData.nDrawCount;
    this.nTablePlayer = oData.nTablePlayer;
    this.nMinTablePlayer = oData.nMinTablePlayer;
    this.dCreatedAt = oData.dCreatedAt;
    this.oSettings = oData.oSettings;
    this.oWinningCard = oData.oWinningCard;
    this.oLobbyData = oData.oLobbyData;
    this.sGameName = oData.sGameName;
    this.nEntryFee = oData.nEntryFee;
    this.aPlayer = oData.aPlayer ?? [];
  }

  public async update(
    oDate: Partial<
      Pick<
        ITable,
        | 'iPlayerTurn'
        | 'iSkippedPLayer'
        | 'iDrawPenltyPlayerId'
        | 'aPlayerId'
        | 'aDrawPile'
        | 'aDiscardPile'
        | 'bToSkip'
        | 'eState'
        | 'bTurnClockwise'
        | 'bIsReverseNow'
        | 'eNextCardColor'
        | 'nDrawCount'
        | 'oSettings'
        | 'oWinningCard'
      >
    >
  ) {
    try {
      const aPromise: Array<Promise<unknown>> = [];
      const sTableKey = _.getTableKey(this.iBattleId);
      Object.entries(oDate).forEach(([k, v]) => {
        switch (k) {
          case 'iPlayerTurn':
            this.iPlayerTurn = v as ITable['iPlayerTurn'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'iSkippedPLayer':
            this.iSkippedPLayer = v as ITable['iSkippedPLayer'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'iDrawPenltyPlayerId':
            this.iDrawPenltyPlayerId = v as ITable['iDrawPenltyPlayerId'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'aPlayerId':
            // WARNING: should be called only through Table.addPlayer()
            this.aPlayerId = v as ITable['aPlayerId'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'aDrawPile':
            this.aDrawPile = v as ITable['aDrawPile'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'aDiscardPile':
            this.aDiscardPile = v as ITable['aDiscardPile'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'bToSkip':
            this.bToSkip = v as ITable['bToSkip'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'eState':
            this.eState = v as ITable['eState'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'bTurnClockwise':
            this.bTurnClockwise = v as ITable['bTurnClockwise'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'bIsReverseNow':
            this.bIsReverseNow = v as ITable['bIsReverseNow'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'eNextCardColor':
            this.eNextCardColor = v as ITable['eNextCardColor'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'nDrawCount':
            this.nDrawCount = v as ITable['nDrawCount'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'oSettings':
            this.oSettings = v as ITable['oSettings'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'oWinningCard':
            this.oWinningCard = v as ITable['oWinningCard'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          default:
            break;
        }
      });
      const aRedisSetResponse = (await Promise.all(aPromise)) as Array<'OK' | null>;
      if (aRedisSetResponse.some(ok => !ok)) log.error('Table.update: redis.client.json.SET failed for some key');

      return this.toJSON();
    } catch (err: any) {
      log.error(`Error Occurred on Table.update(). reason :${err.message}`);
      log.silly(this.toJSON());
      return null;
    }
  }

  public async drawCard(eCardType: 'normal' | 'action' | 'wild' | 'special', nCount: number) {
    const aCards: Table['aDrawPile'] = [];
    let skipSpecialMeter = false;
    const drawnCardType = eCardType === 'normal' ? 'nDrawnNormalCard' : 'nDrawnSpecialCard';
    switch (eCardType) {
      case 'normal':
        for (let i = 0; i < nCount; i += 1) {
          let nCardIndex = this.aDrawPile.findIndex(c => c.nLabel < 10);
          if (nCardIndex === -1) {
            await this.reshuffleClosedDeck();
            nCardIndex = this.aDrawPile.findIndex(c => c.nLabel < 10);
          }
          aCards.push(...this.aDrawPile.splice(nCardIndex, 1));
        }
        break;
      case 'action':
        for (let i = 0; i < nCount; i += 1) {
          let nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 9 && c.nLabel < 13);
          if (nCardIndex === -1) {
            await this.reshuffleClosedDeck();
            nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 9 && c.nLabel < 13);
            if (nCardIndex === -1) {
              nCardIndex = this.aDrawPile.findIndex(c => c.nLabel < 10);
              skipSpecialMeter = true;
            }
          }
          aCards.push(...this.aDrawPile.splice(nCardIndex, 1));
        }
        break;
      case 'wild':
        for (let i = 0; i < nCount; i += 1) {
          let nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 12);
          if (nCardIndex === -1) {
            await this.reshuffleClosedDeck();
            nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 12);
            if (nCardIndex === -1) {
              nCardIndex = this.aDrawPile.findIndex(c => c.nLabel < 10);
              skipSpecialMeter = true;
            }
          }
          aCards.push(...this.aDrawPile.splice(nCardIndex, 1));
        }
        break;
      case 'special':
        for (let i = 0; i < nCount; i += 1) {
          let nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 9);
          if (nCardIndex === -1) {
            await this.reshuffleClosedDeck();
            nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 9);

            if (nCardIndex === -1) {
              nCardIndex = this.aDrawPile.findIndex(c => c.nLabel < 10);
              skipSpecialMeter = true;
            }
          }
          aCards.push(...this.aDrawPile.splice(nCardIndex, 1));
        }
        break;
      default:
        return (log.error(`drawCard called with invalid eCardType: ${eCardType}`) && null) ?? null;
    }
    await this.updateDrawPile(this.aDrawPile);
    if (!aCards.length) return [];
    const player = await this.getPlayer(this.iPlayerTurn);
    const drawnCardCount: any = eCardType === 'normal' ? player?.toJSON().nDrawnNormalCard : player?.toJSON().nDrawnSpecialCard;
    await player?.update({ bSkipSpecialMeterProcess: skipSpecialMeter, [drawnCardType]: drawnCardCount + 1 });
    return aCards;
  }

  public getPlayer(iPlayerId: string) {
    return this.aPlayer.find(oParticipant => oParticipant.toJSON().iPlayerId === iPlayerId) ?? null;
  }

  public async reshuffleClosedDeck() {
    console.log('reshuffleClosedDeck called -->');
    this.aDrawPile = this.aDrawPile.length
      ? [...this.aDrawPile, ...this.aDiscardPile.splice(0, this.aDiscardPile.length - 1)]
      : this.aDiscardPile.splice(0, this.aDiscardPile.length - 1);
    for (let i = 0; i < this.aDrawPile.length; i += 1) {
      if (this.aDrawPile[i].nLabel > 12) {
        this.aDrawPile[i].eColor = 'black';
      }
    }
    await this.update({ aDiscardPile: this.aDiscardPile, aDrawPile: this.aDrawPile });
    this.emit('resShuffleDeck', {});
  }

  public async initializeGame() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { aDrawPile, aPlayer, aPlayerId, ...rest } = this.toJSON();
    const aParticipant = this.toJSON().aPlayer.map(p => {
      const pJson = p.toJSON();
      return { iPlayerId: pJson.iPlayerId, nSeat: pJson.nSeat, nCardCount: pJson.aHand.length };
    });

    const ePreviousState = rest.eState;
    // eslint-disable-next-line eqeqeq
    const bInitializeTable = aPlayerId.length === rest.nTablePlayer && rest.eState === 'waiting';
    rest.eState = bInitializeTable ? 'initialized' : rest.eState;
    this.emit('resTableState', { table: rest, aPlayer: aParticipant });
    if (ePreviousState === 'waiting' && rest.eState === 'initialized') {
      this.initializeGameTimer();
    }
  }

  // eslint-disable-next-line consistent-return
  public async initializeGameTimer() {
    // Create battle for rpc.
    const rpcTable = await rpc.createBattle(
      Number(this.iLobbyId),
      this.iBattleId,
      this.aPlayerId.map(p => Number(p))
    );
    log.debug(`rpcTable in initializeGameTimer ${_.stringify(rpcTable)}`);
    if (!rpcTable || rpcTable.error || !rpcTable.success) return false;
    // // const nBeginCountdown = this.aPlayerId.length === this.oSettings.nTotalPlayerCount ? this.oSettings.nGameInitializeTime / 2 : this.oSettings.nGameInitializeTime;
    const nBeginCountdownCounter = this.oSettings.nGameInitializeTime;
    this.emit('resGameInitializeTimer', { ttl: nBeginCountdownCounter, timestamp: Date.now() });
    // throw new Error(`schedular doesn't exists`);
    this.setSchedular('gameInitializeTimerExpired', '', nBeginCountdownCounter);
  }

  public async addPlayer(oPlayer: Player) {
    const tablePlayerId = [...this.aPlayerId, oPlayer.toJSON().iPlayerId];

    const oUpdateTable = await this.update({ aPlayerId: tablePlayerId });
    if (!oUpdateTable) return false;
    this.aPlayer.push(oPlayer);
    // if (this.aPlayer.length === 1) this.setSchedular('matchMakingExpired', '', this.oSettings.nMatchMakingTime);
    // if (this.aPlayerId.length === this.oSettings.nTotalPlayerCount) {
    if (this.aPlayerId.length === this.nTablePlayer) {
      // this.deleteScheduler('matchMakingExpired', '');
      this.initializeGame();
    }

    return true;
  }

  public async gameOver(oPlayer: Player, eReason: any) {
    await this.update({ eState: 'finished' });
    // const aPlayer = this.toJSON().aPlayer.filter(p => p.eState !== 'left');
    const { aPlayer } = this.toJSON();
    // for(let player of aPlayer){
    for (let i = 0; i < aPlayer.length; i += 1) {
      if (aPlayer[i].eState !== 'left') await aPlayer[i].update({ eState: 'declared' });
      aPlayer[i].nScore = await aPlayer[i].handCardCounts(aPlayer[i].aHand);
    }
    const sortedPlayer = aPlayer
      .sort((a, b) => a.nScore - b.nScore)
      .map((p, i) => {
        return { aHand: p.aHand, nScore: p.nScore, iPlayerId: p.iPlayerId, nRank: i };
      });
    const scoreArray = [];
    aPlayer.sort((a, b) => a.nScore - b.nScore);
    aPlayer.sort((a, b) => {
      const x = a.eState.toLowerCase();
      const y = b.eState.toLowerCase();
      if (x > y) return -1;
      if (x < y) return 1;
      return 0;
    });

    let rank = 1;
    for (let index = 0; index < aPlayer.length; index += 1) {
      if (index > 0 && aPlayer[index].nScore > aPlayer[index - 1].nScore) {
        // eslint-disable-next-line no-plusplus
        rank++;
      }

      scoreArray.push({
        battleId: this.iBattleId,
        userId: aPlayer[index].iPlayerId,
        score: rank,
        scoreData: '{}',
      });
      // const data = {
      //   battleId: this.iBattleId,
      //   userId: aPlayer[index].iPlayerId,
      //   score: rank,
      //   scoreData: '{}',
      // };
      // log.verbose(`data --> ${_.stringify(data)}`);
      sortedPlayer.filter(p => {
        // eslint-disable-next-line no-param-reassign
        if (p.iPlayerId === aPlayer[index].iPlayerId) p.nRank = rank;
        return p;
      });
      const player = await this.getPlayer(aPlayer[index].iPlayerId);
      await player?.sendGameEndData(this.toJSON(), oPlayer);
    }
    const rpcTableScore = await rpc.finishBattleWithScores(this.iGameId, scoreArray);
    this.emit('resGameOver', { aPlayer: sortedPlayer, oWinner: oPlayer, eReason });
    if (rpcTableScore && rpcTableScore.playersData.length) {
      for (let index = 0; index < rpcTableScore.playersData.length; index += 1) {
        rpcTableScore.playersData[index].didPlayerLose = false;
        rpcTableScore.playersData[index].playerWinPercentage = '';
        rpcTableScore.playersData[index].playerWinCount = '';
        rpcTableScore.playersData[index].nextLobbyConfig = '';
        rpcTableScore.playersData[index].isCashReward = true;
        rpcTableScore.playersData[index].extReward = '';
      }
    }
    const payload = {
      players: rpcTableScore.playersData,
      battleAgainDisabled: false,
      battleStatus: rpcTableScore.battleStatus,
    };
    this.emit('resMplFinishBattle', { payload });
    const keys = await redis.client.KEYS(`t:${this.iBattleId}:*`);
    const tbl_keys: any = await redis.client.KEYS(`t:${this.iBattleId}`);
    keys.push(...tbl_keys);
    log.verbose('Table removed');
    if (keys.length) await redis.client.del(keys);
    const schedularKey = await redis.sch.KEYS(`sch:${this.iBattleId}:`);
    if (schedularKey.length) await redis.sch.del(schedularKey);
    return true;
  }

  public async updateDrawPile(aDrawPile?: Table['aDrawPile']) {
    this.aDrawPile = aDrawPile ?? this.aDrawPile;
    await this.update({ aDrawPile: this.aDrawPile });
  }

  public async refundOnLongWait() {
    // Need to send emit to connected players and remove table.
    const { aPlayer } = this.toJSON();
    await aPlayer.map(player => player.emit('resRefundOnLongWait', {}));
    const keys = await redis.client.KEYS(`t:${this.iBattleId}:*`);
    const tbl_keys: any = await redis.client.KEYS(`t:${this.iBattleId}`);
    keys.push(...tbl_keys);
    log.verbose('Table removed on refundOnLongWait');
    if (keys.length) await redis.client.del(keys);
    const schedularKey = await redis.sch.KEYS(`sch:${this.iBattleId}:`);
    if (schedularKey.length) await redis.sch.del(schedularKey);
  }

  public async updateDiscardPile(aDiscardPile?: Table['aDiscardPile']) {
    this.aDiscardPile = aDiscardPile ?? this.aDiscardPile;
    await this.update({ aDiscardPile: this.aDiscardPile });
  }

  public async addToDiscardPile(oCard: ICard) {
    this.aDiscardPile.push(oCard);
    await this.update({ aDiscardPile: this.aDiscardPile });
  }

  public async setSchedular(sTaskName = '', iPlayerId = '', nTimeMS = 0) {
    try {
      if (!sTaskName) return false;
      if (!nTimeMS) return false;
      console.log(sTaskName, this.iBattleId, iPlayerId, nTimeMS, sTaskName);
      await redis.sch.pSetEx(_.getSchedulerKey(sTaskName, this.iBattleId, iPlayerId), nTimeMS, sTaskName);
      return true;
    } catch (err: any) {
      console.log('err.message :: ', _.stringify(err.message));
      console.log('err :: ', _.stringify(err));
      log.error(`table.setSchedular() failed.${{ reason: err.message, stack: err.stack }}`);
      return false;
    }
  }

  public async deleteScheduler(sTaskName = '', iPlayerId = '*') {
    try {
      const sKey = _.getSchedulerKey(sTaskName, this.iBattleId, iPlayerId);
      const schedularKeys = await redis.sch.keys(sKey);
      if (!schedularKeys.length) throw new Error(`schedular doesn't exists`);

      const deletionCount = await redis.sch.del(schedularKeys);
      if (!deletionCount) throw new Error(`can't delete key: ${schedularKeys}`);

      log.silly(`deleted scheduled keys: ${schedularKeys}`);
      return true;
    } catch (err: any) {
      log.error(`table.deleteScheduler(sTaskName: ${sTaskName}, iPlayerId: ${iPlayerId}, iBattleId: ${this.iBattleId}) failed. reason: ${err.message}`);
      return false;
    }
  }

  public async handleReverseCard() {
    await this.update({ bTurnClockwise: !this.bTurnClockwise, bIsReverseNow: true });
    return true;
  }

  public async getTTL(sTaskName = '', iPlayerId = '*') {
    try {
      const sKey = _.getSchedulerKey(sTaskName, this.iBattleId, iPlayerId);
      const schedularKeys = await redis.sch.keys(sKey);
      if (!schedularKeys.length) return null; // - throw new Error(`schedular doesn't exists`);

      if (schedularKeys.length > 1) {
        log.warn(`multiple schedular keys found for ${sKey}, keys: ${schedularKeys}`);
        await redis.sch.del(schedularKeys.slice(1));
      }

      const nTTL = await redis.sch.pTTL(schedularKeys[0]); // - in ms
      if (nTTL < 0) return null; // - -1-> key not exist, -2 -> key exist but without expiry

      return nTTL;
    } catch (err: any) {
      log.error(`table.getTTL(sTaskName: ${sTaskName}, iPlayerId: ${iPlayerId}, iBattleId: ${this.iBattleId}) failed. reason: ${err.message}`);
      return null;
    }
  }

  public async emit(sEventName: string, oData: Record<string, unknown>, exceptPlayerId: Array<string> = []) {
    try {
      this.aPlayer.forEach(p => !exceptPlayerId.includes(p.toJSON().iPlayerId) && p.emit(sEventName, oData));
      return true;
    } catch (err: any) {
      log.error('Table.emit() failed !!!', { reason: err.message });
      return false;
    }
  }

  public toJSON() {
    return {
      iBattleId: this.iBattleId,
      iLobbyId: this.iLobbyId,
      iGameId: this.iGameId,
      iPlayerTurn: this.iPlayerTurn,
      iSkippedPLayer: this.iSkippedPLayer,
      iDrawPenltyPlayerId: this.iDrawPenltyPlayerId,
      aPlayerId: this.aPlayerId,
      aDrawPile: this.aDrawPile,
      aDiscardPile: this.aDiscardPile,
      bToSkip: this.bToSkip,
      bIsReverseNow: this.bIsReverseNow,
      eState: this.eState,
      bTurnClockwise: this.bTurnClockwise,
      eNextCardColor: this.eNextCardColor,
      nDrawCount: this.nDrawCount,
      dCreatedAt: this.dCreatedAt,
      oSettings: this.oSettings,
      oWinningCard: this.oWinningCard,
      sGameName: this.sGameName,
      nTablePlayer: this.nTablePlayer,
      nMinTablePlayer: this.nMinTablePlayer,
      nEntryFee: this.nEntryFee,
      oLobbyData: this.oLobbyData,
      aPlayer: this.aPlayer, //  WARNING : don't save using toJSON() as it contain non-existed field 'aPlayer'
    };
  }
}

export default Service;
