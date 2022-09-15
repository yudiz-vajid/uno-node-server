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

  protected nStartHandSum: IPlayer['nStartHandSum'];

  protected sStartingHand: IPlayer['sStartingHand'];

  protected nUsedNormalCard: IPlayer['nUsedNormalCard'];

  protected nUsedActionCard: IPlayer['nUsedActionCard'];

  protected nUsedSpecialCard: IPlayer['nUsedSpecialCard'];

  protected nDrawnNormalCard: IPlayer['nDrawnNormalCard'];

  protected nDrawnSpecialCard: IPlayer['nDrawnSpecialCard'];

  protected nSkipUsed: IPlayer['nSkipUsed'];

  protected nReverseUsed: IPlayer['nReverseUsed'];

  protected nDraw2Used: IPlayer['nDraw2Used'];

  protected nDraw4Used: IPlayer['nDraw4Used'];

  protected nWildUsed: IPlayer['nWildUsed'];

  protected nUnoPressed: IPlayer['nUnoPressed'];

  protected nUnoMissed: IPlayer['nUnoMissed'];

  protected nSkipped: IPlayer['nSkipped'];

  protected nDrawn2: IPlayer['nDrawn2'];

  protected nDrawn4: IPlayer['nDrawn4'];

  protected nOptionalDraw: IPlayer['nOptionalDraw'];

  // protected aTurnData: IPlayer['aTurnData'];

  protected aDrawnCards: IPlayer['aDrawnCards'];

  constructor(oData: IPlayer) {
    this.iPlayerId = oData.iPlayerId;
    this.iBattleId = oData.iBattleId;
    this.sPlayerName = oData.sPlayerName;
    this.sSocketId = oData.sSocketId;
    this.sStartingHand = oData.sStartingHand;
    this.nSeat = oData.nSeat;
    this.nScore = oData.nScore;
    this.nGraceTime = oData.nGraceTime;
    this.nMissedTurn = oData.nMissedTurn;
    this.nDrawNormal = oData.nDrawNormal;
    this.nUsedNormalCard = oData.nUsedNormalCard;
    this.nUsedActionCard = oData.nUsedActionCard;
    this.nUsedSpecialCard = oData.nUsedSpecialCard;
    this.nDrawnNormalCard = oData.nDrawnNormalCard;
    this.nDrawnSpecialCard = oData.nDrawnSpecialCard;
    this.nStartHandSum = oData.nStartHandSum;
    this.nReconnectionAttempt = oData.nReconnectionAttempt;
    this.nSkipUsed = oData.nSkipUsed;
    this.nReverseUsed = oData.nReverseUsed;
    this.nDraw2Used = oData.nDraw2Used;
    this.nDraw4Used = oData.nDraw4Used;
    this.nWildUsed = oData.nWildUsed;
    this.nUnoPressed = oData.nUnoPressed;
    this.nUnoMissed = oData.nUnoMissed;
    this.nSkipped = oData.nSkipped;
    this.nDrawn2 = oData.nDrawn2;
    this.nDrawn4 = oData.nDrawn4;
    this.nOptionalDraw = oData.nOptionalDraw;
    this.bSpecialMeterFull = oData.bSpecialMeterFull;
    this.bUnoDeclared = oData.bUnoDeclared;
    this.bNextTurnSkip = oData.bNextTurnSkip;
    this.bSkipSpecialMeterProcess = oData.bSkipSpecialMeterProcess;
    this.aHand = oData.aHand;
    // this.aTurnData = oData.aTurnData; // TODO :- Need to remomve this fron entire player service.
    this.aDrawnCards = oData.aDrawnCards;
    this.eState = oData.eState;
    this.dCreatedAt = oData.dCreatedAt;
  }

  // prettier-ignore
  public async update(oData: Partial<Pick<IPlayer, 
      'sSocketId' 
    | 'sStartingHand' 
    | 'nScore' 
    | 'nGraceTime' 
    | 'nMissedTurn' 
    | 'nDrawNormal' 
    | 'nReconnectionAttempt' 
    | 'nStartHandSum' 
    | 'nUsedNormalCard' 
    | 'nUsedActionCard' 
    | 'nUsedSpecialCard' 
    | 'nDrawnNormalCard' 
    | 'nDrawnSpecialCard' 
    | 'nSkipUsed' 
    | 'nWildUsed' 
    | 'nDraw2Used' 
    | 'nDraw4Used' 
    | 'nReverseUsed' 
    | 'nUnoPressed' 
    | 'nUnoMissed' 
    | 'nSkipped' 
    | 'nOptionalDraw' 
    | 'bSpecialMeterFull'
    | 'bNextTurnSkip' 
    | 'bUnoDeclared'
    | 'bSkipSpecialMeterProcess' 
    | 'aHand' 
    | 'aDrawnCards' 
    // | 'aTurnData' 
    | 'eState'>>) {
    try {
      const aPromise: Array<Promise<unknown>> = [];
      const sPlayerKey = _.getPlayerKey(this.iBattleId, this.iPlayerId);
      Object.entries(oData).forEach(([k, v]) => {
        switch (k) {
          case 'sSocketId':
            this.sSocketId = v as IPlayer['sSocketId'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'sStartingHand':
            this.sStartingHand = v as IPlayer['sStartingHand'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nScore':
            this.nScore = v as IPlayer['nScore'];
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
          case 'nStartHandSum':
            this.nStartHandSum = v as IPlayer['nStartHandSum'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nReconnectionAttempt':
            this.nReconnectionAttempt = v as IPlayer['nReconnectionAttempt'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nUsedNormalCard':
            this.nUsedNormalCard = v as IPlayer['nUsedNormalCard'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nUsedActionCard':
            this.nUsedActionCard = v as IPlayer['nUsedActionCard'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nUsedSpecialCard':
            this.nUsedSpecialCard = v as IPlayer['nUsedSpecialCard'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nDrawnNormalCard':
            this.nDrawnNormalCard = v as IPlayer['nDrawnNormalCard'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nDrawnSpecialCard':
            this.nDrawnSpecialCard = v as IPlayer['nDrawnSpecialCard'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nUnoPressed':
            this.nUnoPressed = v as IPlayer['nUnoPressed'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nUnoMissed':
            this.nUnoMissed = v as IPlayer['nUnoMissed'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nSkipped':
            this.nSkipped = v as IPlayer['nSkipped'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          case 'nOptionalDraw':
            this.nOptionalDraw = v as IPlayer['nOptionalDraw'];
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
          case 'aDrawnCards':
            this.aDrawnCards = v as IPlayer['aDrawnCards'];
            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
            break;
          // case 'aTurnData':
          //   this.aTurnData = v as IPlayer['aTurnData'];
          //   aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v as RedisJSON));
          //   break;
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
      log.error(`Error Occurred on Player.update(). reason :${err.message}`);
      log.silly(this.toJSON());
      return null;

    }
  }

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
    const handScore = await this.handCardCounts(this.aHand);
    const aStartingHandArr = this.aHand.map(a => a.iCardId);
    const startingHand = this.aHand.map(c => c.iCardId).join(';');
    this.aDrawnCards.push(...aStartingHandArr);
    await this.update({ aHand: this.aHand, eState: 'playing', nStartHandSum: handScore, sStartingHand: startingHand, aDrawnCards: this.aDrawnCards });
    this.emit('resHand', { aHand: this.aHand, nHandScore: await this.handCardCounts() });
  }

  /**
   * get list of cards for user to play wrt discard pile top card
   */
  public async getPlayableCardIds(oDiscardPileTopCard: any, eNextCardColor?: Table['eNextCardColor']) {
    if (!oDiscardPileTopCard || oDiscardPileTopCard === undefined) return this.aHand;
    if (oDiscardPileTopCard.nLabel === 12)
      return this.aHand.filter(card => card.nLabel > 12 || card.nLabel === 12 || oDiscardPileTopCard.eColor === card.eColor).map(card => card.iCardId);
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
    const nRemainingMasterTime = await oTable.getTTL('masterTimerExpired');
    const aPlayer = oTable.toJSON().aPlayer.map((p: any) => ({
      iPlayerId: p.iPlayerId,
      sPlayerName: p.sPlayerName,
      sSocketId: p.sSocketId,
      nSeat: p.nSeat,
      nHandCardCount: p.aHand.length,
      eState: p.eState,
      nMissedTurn: p.nMissedTurn,
    }));
    const oData = {
      oTable: { ...oTable, aPlayer, aDrawPile: [] },
      aHand: this.aHand,
      nDrawNormal: this.nDrawNormal,
      nScore: await this.handCardCounts(this.aHand),
      nRemainingMasterTime,
      oTurnInfo: {
        iUserTurn,
        ttl,
        nTotalTurnTime: nRemainingGraceTime ? oTable.toJSON().oSettings.nGraceTime : oTable.toJSON().oSettings.nTurnTime,
        bIsGraceTimer: !!nRemainingGraceTime,
        aPlayableCards: iUserTurn === this.iPlayerId ? await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor) : [],
      },
    };
    log.verbose(`oTurnInfo in game state --> ${_.stringify(oData.oTurnInfo)}`);
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
    const timeTaken = Math.abs(Math.round(new Date().getTime() - new Date(oTable.toJSON().dTurnAssignedAt).getTime()));

    oTable.toJSON().aTurnInfo.push({
      Uid: this.iPlayerId,
      Action: 'autoPickCard',
      CardPlayed: [aCard[0].iCardId],
      Score: await this.handCardCounts([...this.aHand, ...aCard]),
      TimeTaken: timeTaken ? timeTaken / 1000 : 0,
      CardsRemaining: [...this.aHand, ...aCard].length,
      LastOne: false,
    });
    this.aDrawnCards.push(aCard[0].iCardId);
    await Promise.all([
      oTable.updateDrawPile(),
      oTable.update({ aTurnInfo: oTable.toJSON().aTurnInfo }),
      ...aPromise,
      this.update({
        nDrawNormal: this.nDrawNormal,
        bSpecialMeterFull: this.bSpecialMeterFull,
        aHand: [...this.aHand, ...aCard],
        // aTurnData: this.aTurnData,
        aDrawnCards: this.aDrawnCards,
      }),
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
    const aCardIds: any = [];
    const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
    for (let i = 0; i < 2; i += 1) {
      const oCard: any = this.bSpecialMeterFull ? await oTable.drawCard('special', 1) : await oTable.drawCard('normal', 1);
      this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
      this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;
      aCard.push(...oCard);
      aCardIds.push(oCard.ICard);
    }
    const timeTaken = Math.abs(Math.round(new Date().getTime() - new Date(oTable.toJSON().dTurnAssignedAt).getTime()));
    oTable.toJSON().aTurnInfo.push({
      Uid: this.iPlayerId,
      Action: 'unoMissedPenalty',
      CardPlayed: [...aCardIds],
      Score: await this.handCardCounts([...this.aHand, ...aCard]),
      TimeTaken: timeTaken ? timeTaken / 1000 : 0,
      CardsRemaining: [...this.aHand, ...aCard].length,
      LastOne: false,
    });
    await Promise.all([
      oTable.updateDrawPile(),
      oTable.update({ aTurnInfo: oTable.toJSON().aTurnInfo }),
      this.update({
        nDrawNormal: this.nDrawNormal,
        bSpecialMeterFull: this.bSpecialMeterFull,
        aHand: [...this.aHand, ...aCard],
        nUnoMissed: this.nUnoMissed + 1,
        // aTurnData: this.aTurnData,
      }),
    ]);
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
    if (oDiscardPileTopCard.nLabel === 12) return oUserCard.nLabel === 12 || oUserCard.nLabel === 13 || oUserCard.nLabel === 14 || oUserCard.eColor === oDiscardPileTopCard.eColor;
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
    const aPlayingPlayer = aPlayer.filter(p => p.eState !== 'left');
    if (!aPlayingPlayer.length) return (log.error('no playing participant') && null) ?? false;
    const oNextPlayer = await oTable.getNextPlayer(this.nSeat);
    if (!oNextPlayer) return (log.error('No playing player found...') && null) ?? false;
    await oNextPlayer.update({ bNextTurnSkip: true, nSkipped: oNextPlayer.toJSON().nSkipped + 1 });
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
    // TODO:- Check drawpile has card or not if not than handle case and penalty should be remove.
    const aCard: any = [];
    const aCardIds: any = [];
    const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
    for (let i = 0; i < oTable.toJSON().nDrawCount; i += 1) {
      const oCard: any = this.bSpecialMeterFull ? await oTable.drawCard('special', 1) : await oTable.drawCard('normal', 1);
      if (!this.bSkipSpecialMeterProcess) {
        this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
        this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;
      }
      aCard.push(...oCard);
      aCardIds.push(oCard[0].iCardId);
    }
    await oTable.updateDrawPile();
    const nLastCard = await oTable.getDiscardPileTopCard();
    const assignPenalty = nLastCard.nLabel === 12 ? 'nDrawn2' : 'nDrawn4';
    const assignPenaltyCount = assignPenalty === 'nDrawn2' ? this.nDrawn2 + 1 : this.nDrawn4 + 1;

    const timeTaken = Math.abs(Math.round(new Date().getTime() - new Date(oTable.toJSON().dTurnAssignedAt).getTime()));

    oTable.toJSON().aTurnInfo.push({
      Uid: this.iPlayerId,
      Action: 'darwPenalty',
      CardPlayed: aCardIds,
      Score: await this.handCardCounts([...this.aHand, ...aCard]),
      TimeTaken: timeTaken ? timeTaken / 1000 : 0,
      CardsRemaining: [...this.aHand, ...aCard].length,
      LastOne: false,
    });
    this.aDrawnCards.push(...aCardIds);
    await this.update({
      nDrawNormal: this.nDrawNormal,
      bSpecialMeterFull: this.bSpecialMeterFull,
      [assignPenalty]: assignPenaltyCount,
      aHand: [...this.aHand, ...aCard],
      bUnoDeclared: false,
      aDrawnCards: this.aDrawnCards,
      // aTurnData: this.aTurnData,
    });
    await oTable.update({ iDrawPenltyPlayerId: '', nDrawCount: 0, aTurnInfo: oTable.toJSON().aTurnInfo });
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
    log.debug(`take turn called for ${this.iPlayerId}`)
    await _.delay(600)
    await oTable.update({ iPlayerTurn: this.iPlayerId,dTurnAssignedAt:new Date() });
    let aStackingCardId:any=[]
    if(oTable.toJSON().aDiscardPile.slice(-1)[0].nLabel===12 || oTable.toJSON().aDiscardPile.slice(-1)[0].nLabel===14){
      if(oTable.toJSON().oSettings.bStackingDrawCards && oTable.toJSON().iDrawPenltyPlayerId===this.iPlayerId){
        aStackingCardId = await this.getStackingCardIds(oTable.getDiscardPileTopCard());  
        if(!aStackingCardId?.length)await this.assignDrawPenalty(oTable)
        if(!aStackingCardId?.length && oTable.toJSON().oSettings.bDisallowPlayOnDrawCardPenalty)return this.skipPlayer(oTable);
      }else if(oTable.toJSON().iDrawPenltyPlayerId===this.iPlayerId){
        await this.assignDrawPenalty(oTable) // Assign penalty card to user
        if(oTable.toJSON().oSettings.bDisallowPlayOnDrawCardPenalty)return this.skipPlayer(oTable);
      }
    }
    if (this.bNextTurnSkip) return this.skipPlayer(oTable);
    const aPlayableCardId =aStackingCardId.length ? aStackingCardId : await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
    log.debug(`${_.now()} discard pile top card:: ${oTable.getDiscardPileTopCard().iCardId}`);
    log.debug(`${_.now()} playable cards for player ${this.iPlayerId}:: ${aPlayableCardId}`);
    this.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nTurnTime-500, timestamp: Date.now(), aPlayableCards: aPlayableCardId, bDrawPileEmpty:oTable.toJSON().aDrawPile.length===0 });
    oTable.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nTurnTime-500, timestamp: Date.now(), aPlayableCards: [],bDrawPileEmpty:oTable.toJSON().aDrawPile.length===0 }, [this.iPlayerId]);
    oTable.setSchedular('assignTurnTimerExpired', this.iPlayerId, oTable.toJSON().oSettings.nTurnTime);
    return true
  }

  // prettier-ignore
  public async assignTurnTimerExpired(oTable: Table) {
    log.debug(`${_.now()} event: assign Turn-Timer Expired, tableID: ${this.iBattleId},playerId${this.iPlayerId},remaining grace timer: ${this.nGraceTime}`);
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
    this.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: this.nGraceTime-500, timestamp: Date.now(), aPlayableCards: aPlayableCardId,bDrawPileEmpty: oTable.toJSON().aDrawPile.length === 0, });
    oTable.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: this.nGraceTime-500, timestamp: Date.now(), aPlayableCards: [],bDrawPileEmpty: oTable.toJSON().aDrawPile.length === 0,  }, [this.iPlayerId]);
    oTable.setSchedular('assignGraceTimerExpired', this.iPlayerId, this.toJSON().nGraceTime);
    return true;
  }

  public async assignGraceTimerExpired(oTable: Table) {
    log.debug(`${_.now()} event: assign Grace-Timer Expired, tableID: ${this.iBattleId},playerId${this.iPlayerId}`);
    await this.update({ nMissedTurn: this.nMissedTurn + 1, nGraceTime: 0 });
    const aPlayableCardId = await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
    if (oTable.toJSON().iDrawPenltyPlayerId === this.iPlayerId && (!aPlayableCardId.length || (aPlayableCardId.length && oTable.toJSON().oSettings.bMustCollectOnMissTurn))) {
      await this.assignDrawPenalty(oTable);
    } else if (!aPlayableCardId.length) this.autoPickCard(oTable);
    else if (aPlayableCardId.length && oTable.toJSON().oSettings.bMustCollectOnMissTurn) this.autoPickCard(oTable);

    oTable.emit('resTurnMissed', { iPlayerId: this.iPlayerId, nMissedTurn: this.nMissedTurn });
    // eslint-disable-next-line no-return-await
    if (this.nMissedTurn >= oTable.toJSON().oSettings.nTotalSkipTurnCount) return await this.leftPlayer(oTable, 'missTurnLimit');
    return this.passTurn(oTable);
  }

  public async assignWildCardColorTimerExpired(oTable: Table) {
    log.debug(`${_.now()} event: WildCard Color Timer Expired, tableID: ${this.iBattleId},playerId${this.iPlayerId}`);
    const randomColor: any = _.randomizeArray(['red', 'green', 'blue', 'yellow']);
    const updatedDiscardPile = [...oTable.toJSON().aDiscardPile];
    // eslint-disable-next-line prefer-destructuring
    updatedDiscardPile[updatedDiscardPile.length - 1].eColor = randomColor[0];
    await oTable.update({ aDiscardPile: updatedDiscardPile });
    oTable.emit('resWildCardColor', { iPlayerId: this.iPlayerId, eColor: randomColor[0] });
    // await oTable.deleteScheduler(`assignWildCardColorTimerExpired`, this.iPlayerId); // added
    return this.passTurn(oTable);
  }

  public async leftPlayer(oTable: Table, reason: any) {
    await _.delay(600);
    await this.update({ eState: 'left' });
    oTable.emit('resPlayerLeft', { iPlayerId: this.iPlayerId });
    const aPlayingPlayer = oTable.toJSON().aPlayer.filter(p => p.eState !== 'left');
    if (aPlayingPlayer.length <= 1) {
      await oTable.update({ sGameEndReasons: 'User Disconnected' });
      return oTable.gameOver(aPlayingPlayer[0], 'playerLeft');
    }
    return this.passTurn(oTable);
  }

  public async passTurn(oTable: Table) {
    log.debug('turn pass to next player');
    if (oTable.toJSON().eState !== 'running') return log.error('table is not in running state.');
    if (!this.aHand.length) {
      if (oTable.toJSON().iDrawPenltyPlayerId) {
        const penaltyPlayer = oTable.getPlayer(oTable.toJSON().iDrawPenltyPlayerId);
        if (penaltyPlayer && penaltyPlayer?.eState !== 'left') await penaltyPlayer.assignDrawPenalty(oTable);
      }
      const winner: any = await oTable.getPlayer(this.iPlayerId);
      await oTable.update({ oWinningCard: oTable.getDiscardPileTopCard(), sGameEndReasons: 'All Levels Completed' });
      return oTable.gameOver(winner, 'playerWin');
    }
    const { aPlayer } = oTable.toJSON();

    const aPlayingPlayer = aPlayer.filter(p => p.eState !== 'left');
    if (!aPlayingPlayer.length) return (log.error('no playing participant') && null) ?? false;
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

  public async sendGameEndData(oTable: ITable, oWinner: any) {
    const data = {
      User_ID: this.iPlayerId,
      Battle_ID: this.iBattleId,
      Game_ID: oTable.iGameId,
      Game_name: oTable.sGameName,
      Tournament_ID: '',
      Entry_Fee: oTable.nEntryFee,
      Score: this.nScore,
      Is_Won: _.isEqual(this.iPlayerId, oWinner?.iPlayerId),
      Start_Sum: this.nStartHandSum,
      Start_hand: this.sStartingHand,
      Game_Winning_Card: oTable.oWinningCard,
      Total_Normal_Cards: this.nUsedNormalCard,
      Total_Action_Cards: this.nUsedActionCard,
      Total_Wild_Cards: this.nUsedSpecialCard,
      Normal_Drawn: this.nDrawnNormalCard,
      Special_Drawn: this.nDrawnSpecialCard,
      Used_Skip: this.nSkipUsed,
      Used_Reverse: this.nReverseUsed,
      Used_Draw2: this.nDraw2Used,
      Used_Draw4: this.nDraw4Used,
      Used_Wildcard: this.nWildUsed,
      Tapped_Uno: this.nUnoPressed,
      Missed_Uno: this.nUnoMissed,
      Times_Skipped: this.nSkipped,
      Times_Draw2: this.nDrawn2,
      Times_Draw4: this.nDrawn4,
      Draw_Choice: this.nOptionalDraw,
    };
    // log.verbose(`GameStatistics --> ${data}`);
    this.emit('resGameStatistics', { data });
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
      sStartingHand: this.sStartingHand,
      nSeat: this.nSeat,
      nScore: this.nScore,
      nGraceTime: this.nGraceTime,
      nMissedTurn: this.nMissedTurn,
      // Instrumentation params
      nStartHandSum: this.nStartHandSum,
      nDrawNormal: this.nDrawNormal,
      nReconnectionAttempt: this.nReconnectionAttempt,
      nUsedNormalCard: this.nUsedNormalCard,
      nUsedActionCard: this.nUsedActionCard,
      nUsedSpecialCard: this.nUsedSpecialCard,
      nDrawnNormalCard: this.nDrawnNormalCard,
      nDrawnSpecialCard: this.nDrawnSpecialCard,
      nSkipUsed: this.nSkipUsed,
      nReverseUsed: this.nReverseUsed,
      nDraw2Used: this.nDraw2Used,
      nDraw4Used: this.nDraw4Used,
      nWildUsed: this.nWildUsed,
      nUnoPressed: this.nUnoPressed,
      nUnoMissed: this.nUnoMissed,
      nSkipped: this.nSkipped,
      nDrawn2: this.nDrawn2,
      nDrawn4: this.nDrawn4,
      nOptionalDraw: this.nOptionalDraw,

      bSpecialMeterFull: this.bSpecialMeterFull,
      bSkipSpecialMeterProcess: this.bSkipSpecialMeterProcess,
      aHand: this.aHand,
      aDrawnCards: this.aDrawnCards,
      // aTurnData: this.aTurnData,
      eState: this.eState,
      dCreatedAt: this.dCreatedAt,
    };
  }
}

export default Service;
