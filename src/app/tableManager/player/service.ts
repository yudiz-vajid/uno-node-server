/* eslint-disable class-methods-use-this */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
import { ICard, IPlayer, ITable, RedisJSON } from '../../../types/global';
import type Table from '../table';

class Service {
  public readonly iPlayerId: IPlayer['iPlayerId'];

  protected readonly iBattleId: IPlayer['iBattleId'];

  protected readonly sPlayerName: IPlayer['sPlayerName'];

  protected sSocketId: IPlayer['sSocketId'];

  protected readonly nSeat: IPlayer['nSeat'];

  public nScore: IPlayer['nScore'];

  protected nUnoTime: IPlayer['nUnoTime'];

  protected nGraceTime: IPlayer['nGraceTime'];

  protected nMissedTurn: IPlayer['nMissedTurn'];

  protected nDrawNormal: IPlayer['nDrawNormal'];

  protected nReconnectionAttempt: IPlayer['nReconnectionAttempt'];

  protected bSpecialMeterFull: IPlayer['bSpecialMeterFull'];

  protected bNextTurnSkip: IPlayer['bNextTurnSkip'];

  protected bUnoDeclared: IPlayer['bUnoDeclared'];

  public aHand: IPlayer['aHand'];

  public eState: IPlayer['eState'];

  protected readonly dCreatedAt: IPlayer['dCreatedAt'];

  public bSkipSpecialMeterProcess: IPlayer['bSkipSpecialMeterProcess'];

  constructor(oData: IPlayer) {
    this.iPlayerId = oData.iPlayerId;
    this.iBattleId = oData.iBattleId;
    this.sPlayerName = oData.sPlayerName;
    this.sSocketId = oData.sSocketId;
    this.nSeat = oData.nSeat;
    this.nScore = oData.nScore;
    this.nUnoTime = oData.nUnoTime;
    this.nGraceTime = oData.nGraceTime;
    this.nMissedTurn = oData.nMissedTurn;
    this.nDrawNormal = oData.nDrawNormal;
    this.nReconnectionAttempt = oData.nReconnectionAttempt;
    this.bSpecialMeterFull = oData.bSpecialMeterFull;
    this.bUnoDeclared = oData.bUnoDeclared;
    this.bNextTurnSkip = oData.bNextTurnSkip;
    this.bSkipSpecialMeterProcess = oData.bSkipSpecialMeterProcess;
    this.aHand = oData.aHand;
    this.eState = oData.eState;
    this.dCreatedAt = oData.dCreatedAt;
  }

  // prettier-ignore
  public async update(oData: Partial<Pick<IPlayer, 'sSocketId' | 'nScore' | 'nUnoTime' | 'nGraceTime' | 'nMissedTurn' | 'nDrawNormal' | 'nReconnectionAttempt' | 'bSpecialMeterFull'|'bNextTurnSkip' |'bUnoDeclared'| 'bSkipSpecialMeterProcess' | 'aHand' | 'eState'>>) {
    try {
      const aPromise: Array<Promise<unknown>> = [];
      const sPlayerKey = _.getPlayerKey(this.iBattleId, this.iPlayerId);
      Object.entries(oData).forEach(([k, v]) => {
        switch (k) {
          case 'sSocketId':
            this.sSocketId = v as IPlayer['sSocketId'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nScore':
            this.nScore = v as IPlayer['nScore'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nUnoTime':
            this.nUnoTime = v as IPlayer['nUnoTime'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nGraceTime':
            this.nGraceTime = v as IPlayer['nGraceTime'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nMissedTurn':
            this.nMissedTurn = v as IPlayer['nMissedTurn'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nDrawNormal':
            this.nDrawNormal = v as IPlayer['nDrawNormal'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nReconnectionAttempt':
            this.nReconnectionAttempt = v as IPlayer['nReconnectionAttempt'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'bSpecialMeterFull':
            this.bSpecialMeterFull = v as IPlayer['bSpecialMeterFull'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'bNextTurnSkip':
            this.bNextTurnSkip = v as IPlayer['bNextTurnSkip'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'bUnoDeclared':
            this.bUnoDeclared = v as IPlayer['bUnoDeclared'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'bSkipSpecialMeterProcess':
            this.bSkipSpecialMeterProcess = v as IPlayer['bSkipSpecialMeterProcess'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'aHand':
            this.aHand = v as IPlayer['aHand'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'eState':
            this.eState = v as IPlayer['eState'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          default:
            break;
        }
      });
      const aRedisSetResponse = (await Promise.all(aPromise)) as Array<'OK' | null>;
      if (aRedisSetResponse.some(ok => !ok)) log.error('Player.update() failed. reason: redis.client.json.SET failed for some key');

      return this.toJSON();
    } catch (err: any) {
      console.log('oData :: ',oData);
      log.error(`Error Occurred on Player.update(). reason :${err.message}`);
      log.silly(this.toJSON());
console.log('hello');
      return null;

    }
  }

  // TODO: reconnection
  public async reconnect(sSocketId: string, oTable: Table) {
    const stateMapper = { waiting: 'waiting', initialized: 'waiting', running: 'playing', finished: 'left' };
    await this.update({ sSocketId, eState: stateMapper[oTable.toJSON().eState] as IPlayer['eState'] });
    await this.getGameState(oTable);
    log.debug(`${_.now()} client: ${this.iPlayerId} reconnected to table : ${this.iBattleId} with socketId : ${sSocketId}`);
    return true;
  }

  public async emit(sEventName: string, oData: Record<string, unknown> = {}) {
    if (!sEventName) return false;
    if (this.sSocketId) global.io.to(this.sSocketId).emit(this.iBattleId, _.stringify({ sTaskName: sEventName, oData })); // cb not supported while broadcasting
    if (process.env.NODE_ENV !== 'prod') global.io.to(this.sSocketId).emit('postman', { sTaskName: sEventName, oData });
    return true;
  }

  /**
   * set player hand on distribute cards
   *
   * set player state to 'playing'
   */
  public async setHand(aNormalCard: Table['aDrawPile'], aActionCard: Table['aDrawPile'], aWildCard: Table['aDrawPile']) {
    // log.verbose(`setHand called for user ${this.iPlayerId}`);

    this.aHand.push(...aNormalCard);
    this.aHand.push(...aActionCard);
    this.aHand.push(...aWildCard);

    await this.update({ aHand: this.aHand, eState: 'playing' });
    this.emit('resHand', { aHand: this.aHand, nHandScore: await this.handCardCounts() });
  }

  /**
   * get list of cards for user to play wrt discard pile top card
   */
  public async getPlayableCardIds(oDiscardPileTopCard: any, eNextCardColor?: Table['eNextCardColor']) {
    if (!oDiscardPileTopCard || oDiscardPileTopCard === undefined) return this.aHand;
    if (oDiscardPileTopCard.nLabel === 12)
      return this.aHand.filter(card => card.nLabel > 12 || card.nLabel === 12 || oDiscardPileTopCard.eColor === card.eColor).map(card => card.iCardId); // TODO check color as well
    if (oDiscardPileTopCard.nLabel === 14)
      return this.aHand.filter(card => card.nLabel > 12 || card.nLabel === 14 || oDiscardPileTopCard.eColor === card.eColor).map(card => card.iCardId);
    if (oDiscardPileTopCard.nLabel === 13) return this.aHand.filter(card => card.nLabel > 12 || card.eColor === oDiscardPileTopCard.eColor).map(card => card.iCardId);
    return this.aHand
      .filter(card => oDiscardPileTopCard.eColor === card.eColor || oDiscardPileTopCard.nLabel === card.nLabel || card.nLabel === 13 || card.nLabel === 14)
      .map(card => card.iCardId);
  }

  public async getGameState(oTable: Table) {
    const iUserTurn = oTable.toJSON().iPlayerTurn;
    log.verbose('getGameState called...');
    const nRemainingGraceTime = await oTable.getTTL('assignGraceTimerExpired', iUserTurn); // - in ms
    const ttl = nRemainingGraceTime || (await oTable.getTTL('assignTurnTimerExpired', iUserTurn));
    const aPlayer = oTable.toJSON().aPlayer.map((p: any) => ({
      iPlayerId: p.iPlayerId,
      sPlayerName: p.sPlayerName,
      sSocketId: p.sSocketId,
      nSeat: p.nSeat,
      nHandCardCount: p.aHand.length,
      eState: p.eState,
    }));
    const oData = {
      oTable: { ...oTable, aPlayer, aDrawPile: [] },
      myHand: this.aHand,
      oTurnInfo: {
        iUserTurn,
        ttl,
        nTotalTurnTime: nRemainingGraceTime ? oTable.toJSON().oSettings.nGraceTime : oTable.toJSON().oSettings.nTurnTime,
        bIsGraceTimer: !!nRemainingGraceTime,
        aPlayableCards: iUserTurn === this.iPlayerId ? this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor) : [],
      },
    };
    await this.emit('resGameState', oData);
  }

  // eslint-disable-next-line consistent-return
  public async getStackingCardIds(oDiscardPileTopCard: ICard) {
    // if (oDiscardPileTopCard.nLabel === 12) return this.aHand.filter(card => card.nLabel === 12&&oDiscardPileTopCard.eColor=== card.eColor).map(card => card.iCardId);
    if (oDiscardPileTopCard.nLabel === 12) return this.aHand.filter(card => card.nLabel === 12).map(card => card.iCardId);
    if (oDiscardPileTopCard.nLabel === 14) return this.aHand.filter(card => card.nLabel === 14).map(card => card.iCardId);
  }

  /**
   * get list of cards for user to play wrt discard pile top card
   */
  public async handCardCounts(aHand = this.aHand) {
    console.log(this.aHand);
    const nPlayerScore = aHand.reduce((p, c) => p + c.nScore, 0);
    return nPlayerScore;
  }

  /**
   *
   * @param oDiscardPileTopCard
   * @param eNextCardColor
   * @returns
   */
  public async autoPickCard(oTable: Table) {
    log.verbose(`${_.now()} event: autoPickCard, player: ${this.iPlayerId}`);
    const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
    const aCard: any = this.bSpecialMeterFull ? await oTable.drawCard('special', 1) : await oTable.drawCard('normal', 1);
    this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
    this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;

    const aPromise: any = [];
    if (this.bUnoDeclared && this.aHand.length + 1 > 2) aPromise.push(this.update({ bUnoDeclared: false }));
    await Promise.all([
      oTable.updateDrawPile(),
      ...aPromise,
      this.update({ nDrawNormal: this.nDrawNormal, bSpecialMeterFull: this.bSpecialMeterFull, aHand: [...this.aHand, ...aCard] }),
    ]);

    this.emit('resDrawCard', {
      iPlayerId: this.iPlayerId,
      aCard: [aCard[0]],
      nCardCount: 1,
      nDrawNormal: this.nDrawNormal,
      nSpecialMeterFillCount: oTable.toJSON().oSettings.nSpecialMeterFillCount,
      nHandCardCount: this.aHand.length,
      nHandScore: await this.handCardCounts(),
      eReason: 'autoDraw',
    });
    oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, aCard: [], nCardCount: 1, nHandCardCount: this.aHand.length, eReason: 'autoDraw' }, [this.iPlayerId]);
    await _.delay(300);
  }

  public async assignUnoMissPenalty(oTable: Table) {
    log.verbose(`${_.now()} event: autoPickCard, player: ${this.iPlayerId}`);
    const aCard: any = [];
    const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
    for (let i = 0; i < 2; i += 1) {
      const oCard: any = this.bSpecialMeterFull ? await oTable.drawCard('special', 1) : await oTable.drawCard('normal', 1);
      this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
      this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;
      aCard.push(...oCard);
    }
    await Promise.all([oTable.updateDrawPile(), this.update({ nDrawNormal: this.nDrawNormal, bSpecialMeterFull: this.bSpecialMeterFull, aHand: [...this.aHand, ...aCard] })]);
    this.emit('resDrawCard', {
      iPlayerId: this.iPlayerId,
      aCard,
      nCardCount: 2,
      nDrawNormal: this.nDrawNormal,
      nSpecialMeterFillCount: oTable.toJSON().oSettings.nSpecialMeterFillCount,
      nHandCardCount: this.aHand.length,
      nHandScore: await this.handCardCounts(),
      eReason: 'unoMissPenalty',
    });
    oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, aCard: [], nCardCount: 2, nHandCardCount: this.aHand.length, eReason: 'unoMissPenalty' }, [this.iPlayerId]);
    await _.delay(300 * 2); // draw card animation.per card 300 ml
  }

  /**
   * check if given card is playable or not NOTE :- just for single card only.
   */
  public async checkPlayableCard(oDiscardPileTopCard: ICard, eNextCardColor?: Table['eNextCardColor'], oUserCard?: any) {
    if (oDiscardPileTopCard.nLabel === 12) return oUserCard.nLabel === 12 || oUserCard.eColor === oDiscardPileTopCard.eColor;
    if (oDiscardPileTopCard.nLabel === 14) return oUserCard.nLabel === 14 || oUserCard.eColor === oDiscardPileTopCard.eColor;
    if (oDiscardPileTopCard.nLabel === 13) return oUserCard.nLabel > 12 || oUserCard.eColor === oDiscardPileTopCard.eColor;
    return oDiscardPileTopCard.eColor === oUserCard.eColor || oDiscardPileTopCard.nLabel === oUserCard.nLabel || oUserCard.nLabel === 13 || oUserCard.nLabel === 14;
  }

  /**
   *
   * @param oTable skip player turn
   * need bNextTurnSkip false as turn is skipped
   */
  async assignSkipCard(oTable: Table) {
    if (oTable.toJSON().eState !== 'running') return log.error('table is not in running state.');
    const { aPlayer } = oTable.toJSON();
    const aPlayingPlayer = aPlayer.filter(p => p.eState === 'playing');
    if (!aPlayingPlayer.length) return (log.error('no playing participant') && null) ?? false; // TODO: declare result
    const oNextPlayer = await oTable.getNextPlayer(this.nSeat);
    if (!oNextPlayer) return (log.error('No playing player found...') && null) ?? false;
    await oNextPlayer.update({ bNextTurnSkip: true });
    return oNextPlayer.iPlayerId;
  }

  /**
   *
   * @param oTable skip player turn
   * need bNextTurnSkip false as turn is skipped
   */
  async skipPlayer(oTable: Table) {
    this.bNextTurnSkip = false;
    // oTable.emit('resSkippedPlayer', { iPlayerId: this.iPlayerId }); // Not required from front side @keval.
    await this.update({ bNextTurnSkip: this.bNextTurnSkip });
    this.passTurn(oTable);
  }

  async assignDrawPenalty(oTable: Table) {
    // add penalty card to user along wih spcial meter
    const aCard: any = [];
    const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
    for (let i = 0; i < oTable.toJSON().nDrawCount; i += 1) {
      const oCard: any = this.bSpecialMeterFull ? await oTable.drawCard('special', 1) : await oTable.drawCard('normal', 1);
      if (!this.bSkipSpecialMeterProcess) {
        this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
        this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;
      }
      aCard.push(...oCard);
    }
    await oTable.updateDrawPile();
    await this.update({ nDrawNormal: this.nDrawNormal, bSpecialMeterFull: this.bSpecialMeterFull, aHand: [...this.aHand, ...aCard], bUnoDeclared: false });
    await oTable.update({ iDrawPenltyPlayerId: '', nDrawCount: 0 });
    // await _.delay(300*aCard.length)
    this.emit('resDrawCard', {
      iPlayerId: this.iPlayerId,
      aCard,
      nCardCount: aCard.length,
      nHandCardCount: this.aHand.length,
      nDrawNormal: this.nDrawNormal,
      nSpecialMeterFillCount,
      nHandScore: await this.handCardCounts(),
      eReason: 'drawCardPenalty',
    });
    oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, aCard: [], nCardCount: aCard.length, nHandCardCount: this.aHand.length, eReason: 'drawCardPenalty' }, [this.iPlayerId]);
    await _.delay(300 * aCard.length); // draw card animation.
    // this.passTurn(oTable);
  }

  // prettier-ignore
  public async takeTurn(oTable: Table) {
    await _.delay(600)
    await oTable.update({ iPlayerTurn: this.iPlayerId });
    let aStackingCardId:any=[]
    if(oTable.toJSON().aDiscardPile.slice(-1)[0].nLabel===12 || oTable.toJSON().aDiscardPile.slice(-1)[0].nLabel===14){
      if(oTable.toJSON().oSettings.bStackingDrawCards && oTable.toJSON().iDrawPenltyPlayerId===this.iPlayerId){
        aStackingCardId = await this.getStackingCardIds(oTable.getDiscardPileTopCard());  
        if(!aStackingCardId?.length)await this.assignDrawPenalty(oTable)
        if(!aStackingCardId?.length && oTable.toJSON().oSettings.bSkipTurnOnDrawTwoOrFourCard)return this.skipPlayer(oTable);
      }else if(oTable.toJSON().iDrawPenltyPlayerId===this.iPlayerId){
        await this.assignDrawPenalty(oTable) // Assign penalty card to user
        if(oTable.toJSON().oSettings.bSkipTurnOnDrawTwoOrFourCard)return this.skipPlayer(oTable);
      }
    }
    if (this.bNextTurnSkip) return this.skipPlayer(oTable);
    const aPlayableCardId =aStackingCardId.length ? aStackingCardId : await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
    log.debug(`${_.now()} discard pile top card:: ${oTable.getDiscardPileTopCard().iCardId}`);
    log.debug(`${_.now()} playable cards for player ${this.iPlayerId}:: ${aPlayableCardId}`);
    this.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nTurnTime-500, timestamp: Date.now(), aPlayableCards: aPlayableCardId });
    oTable.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nTurnTime-500, timestamp: Date.now(), aPlayableCards: [] }, [this.iPlayerId]);
    oTable.setSchedular('assignTurnTimerExpired', this.iPlayerId, oTable.toJSON().oSettings.nTurnTime);
    return true
  }

  // prettier-ignore
  public async assignTurnTimerExpired(oTable: Table) {
    // log.verbose('assignTurnTimerExpired called...');
    if (this.nGraceTime < 3) return this.assignGraceTimerExpired(oTable); // Nothing changed in table so no need to save it. // ? why
    // const aPlayableCardId = await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
    // this.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nGraceTime, timestamp: Date.now(), aPlayableCards: aPlayableCardId });
    // oTable.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nGraceTime, timestamp: Date.now(), aPlayableCards: []  }, [this.iPlayerId]);
    // start stacking 
    let aStackingCardId:any=[]
    if(oTable.toJSON().aDiscardPile.slice(-1)[0].nLabel===12 || oTable.toJSON().aDiscardPile.slice(-1)[0].nLabel===14){
      if(oTable.toJSON().oSettings.bStackingDrawCards && oTable.toJSON().iDrawPenltyPlayerId===this.iPlayerId){
        aStackingCardId = await this.getStackingCardIds(oTable.getDiscardPileTopCard());  
      }
    }
    // end stacking 

    const aPlayableCardId =aStackingCardId.length ? aStackingCardId : await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
    this.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: this.nGraceTime-500, timestamp: Date.now(), aPlayableCards: aPlayableCardId });
    oTable.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: this.nGraceTime-500, timestamp: Date.now(), aPlayableCards: []  }, [this.iPlayerId]);
    oTable.setSchedular('assignGraceTimerExpired', this.iPlayerId, this.toJSON().nGraceTime);
    return true;
  }

  public async assignGraceTimerExpired(oTable: Table) {
    // log.verbose('assignGraceTimerExpired called...');
    await this.update({ nMissedTurn: this.nMissedTurn + 1, nGraceTime: 0 });
    const aPlayableCardId = await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
    if (oTable.toJSON().iDrawPenltyPlayerId === this.iPlayerId && (!aPlayableCardId.length || (aPlayableCardId.length && oTable.toJSON().oSettings.bMustCollectOnMissTurn))) {
      await this.assignDrawPenalty(oTable);
    } else if (!aPlayableCardId.length) this.autoPickCard(oTable);
    else if (aPlayableCardId.length && oTable.toJSON().oSettings.bMustCollectOnMissTurn) this.autoPickCard(oTable);

    oTable.emit('resTurnMissed', { iPlayerId: this.iPlayerId, nMissedTurn: this.nMissedTurn });
    /**
     * TODO : kick process for player if missed turn is more than 3 times.
     */
    // eslint-disable-next-line no-return-await
    if (this.nMissedTurn >= oTable.toJSON().oSettings.nTotalSkipTurnCount) return await this.leftPlayer(oTable, 'missTurnLimit');
    return this.passTurn(oTable);
  }

  public async assignWildCardColorTimerExpired(oTable: Table) {
    /**
     * TODO : set wild card random color
     * Pass turn
     */
    const randomColor: any = _.randomizeArray(['red', 'green', 'blue', 'yellow']);
    const updatedDiscardPile = [...oTable.toJSON().aDiscardPile];
    // eslint-disable-next-line prefer-destructuring
    updatedDiscardPile[updatedDiscardPile.length - 1].eColor = randomColor[0];
    await oTable.update({ aDiscardPile: updatedDiscardPile });
    oTable.emit('resWildCardColor', { iPlayerId: this.iPlayerId, eColor: randomColor[0] });
    return this.passTurn(oTable);
  }

  public async leftPlayer(oTable: Table, reason: any) {
    await _.delay(600);
    await this.update({ eState: 'left' });
    oTable.emit('resPlayerLeft', { iPlayerId: this.iPlayerId });
    // TODO :- need to check for game finish.
    const aPlayingPlayer = oTable.toJSON().aPlayer.filter(p => p.eState === 'playing');
    if (aPlayingPlayer.length <= 1) return oTable.gameOver(aPlayingPlayer[0], 'playerLeft');
    return this.passTurn(oTable);
    // oTable.
  }

  public async passTurn(oTable: Table) {
    if (oTable.toJSON().eState !== 'running') return log.error('table is not in running state.');
    if (!this.aHand.length) {
      if (oTable.toJSON().iDrawPenltyPlayerId) {
        const penaltyPlayer = oTable.getPlayer(oTable.toJSON().iDrawPenltyPlayerId);
        if (penaltyPlayer?.eState === 'playing') await penaltyPlayer.assignDrawPenalty(oTable);
      }
      const winner: any = await oTable.getPlayer(this.iPlayerId);
      return oTable.gameOver(winner, 'playerWin');
    }
    const { aPlayer } = oTable.toJSON();

    const aPlayingPlayer = aPlayer.filter(p => p.eState === 'playing');
    if (!aPlayingPlayer.length) return (log.error('no playing participant') && null) ?? false; // TODO: declare result
    let oNextPlayer;
    if (aPlayingPlayer.length === 2 && oTable.toJSON().aDiscardPile[oTable.toJSON().aDiscardPile.length - 1].nLabel === 11 && oTable.toJSON().bIsReverseNow) {
      oNextPlayer = await oTable.getPlayer(this.iPlayerId);
      await oTable.update({ bIsReverseNow: false });
    } else {
      oNextPlayer = await oTable.getNextPlayer(this.nSeat); // For reverse card flow
    }
    if (!oNextPlayer) return (log.error('No playing player found...') && null) ?? false;
    oNextPlayer.takeTurn(oTable);
    return true;
  }

  public async wildCardColorTimer(oTable: Table) {
    log.verbose('wildCardColorTimer...');
    if (oTable.toJSON().eState !== 'running') return log.error('table is not in running state.');
    oTable.setSchedular('assignWildCardColorTimerExpired', this.iPlayerId, oTable.toJSON().oSettings.nWildCardColorTimer);
    return true;
  }

  public toJSON() {
    return {
      iPlayerId: this.iPlayerId,
      iBattleId: this.iBattleId,
      sPlayerName: this.sPlayerName,
      sSocketId: this.sSocketId,
      nSeat: this.nSeat,
      nScore: this.nScore,
      nUnoTime: this.nUnoTime,
      nGraceTime: this.nGraceTime,
      nMissedTurn: this.nMissedTurn,
      nDrawNormal: this.nDrawNormal,
      nReconnectionAttempt: this.nReconnectionAttempt,
      bSpecialMeterFull: this.bSpecialMeterFull,
      bSkipSpecialMeterProcess: this.bSkipSpecialMeterProcess,
      aHand: this.aHand,
      eState: this.eState,
      dCreatedAt: this.dCreatedAt,
    };
  }
}

export default Service;
