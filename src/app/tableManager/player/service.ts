import { ICard, IPlayer, ITable, RedisJSON } from '../../../types/global';
import type Table from '../table';

class Service {
  protected readonly iPlayerId: IPlayer['iPlayerId'];

  protected readonly iBattleId: IPlayer['iBattleId'];

  protected readonly sPlayerName: IPlayer['sPlayerName'];

  protected sSocketId: IPlayer['sSocketId'];

  protected readonly nSeat: IPlayer['nSeat'];

  protected nScore: IPlayer['nScore'];

  protected nUnoTime: IPlayer['nUnoTime'];

  protected nGraceTime: IPlayer['nGraceTime'];

  protected nMissedTurn: IPlayer['nMissedTurn'];

  protected nDrawNormal: IPlayer['nDrawNormal'];

  protected nReconnectionAttempt: IPlayer['nReconnectionAttempt'];

  protected bSpecialMeterFull: IPlayer['bSpecialMeterFull'];

  protected aHand: IPlayer['aHand'];

  protected eState: IPlayer['eState'];

  protected readonly dCreatedAt: IPlayer['dCreatedAt'];

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
    this.aHand = oData.aHand;
    this.eState = oData.eState;
    this.dCreatedAt = oData.dCreatedAt;
  }

  // prettier-ignore
  public async update(oData: Partial<Pick<IPlayer, 'sSocketId' | 'nScore' | 'nUnoTime' | 'nGraceTime' | 'nMissedTurn' | 'nDrawNormal' | 'nReconnectionAttempt' | 'bSpecialMeterFull' | 'aHand' | 'eState'>>) {
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
      log.error(`Error Occurred on Player.update(). reason :${err.message}`);
      log.silly(this.toJSON());
      return null;
    }
  }

  // TODO: reconnection
  public async reconnect(sSocketId: string, eTableState: ITable['eState']) {
    const stateMapper = { waiting: 'waiting', initialized: 'waiting', running: 'playing', finished: 'left' };
    await this.update({ sSocketId, eState: stateMapper[eTableState] as IPlayer['eState'] });
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
    this.emit('resHand', { aHand: this.aHand });
  }

  /**
   * get list of cards for user to play wrt discard pile top card
   */
  public async getPlayableCardIds(oDiscardPileTopCard: ICard, eNextCardColor?: Table['eNextCardColor']) {
    if (oDiscardPileTopCard.nLabel === 12) return this.aHand.filter(card => card.nLabel === 12||oDiscardPileTopCard.eColor=== card.eColor).map(card => card.iCardId); // TODO check color as well
    if (oDiscardPileTopCard.nLabel === 14) return this.aHand.filter(card => card.nLabel === 14||oDiscardPileTopCard.eColor=== card.eColor).map(card => card.iCardId);
    if (oDiscardPileTopCard.nLabel === 13) return this.aHand.filter(card => card.nLabel > 12 || card.eColor === eNextCardColor).map(card => card.iCardId);
    return this.aHand
      .filter(card => oDiscardPileTopCard.eColor === card.eColor || oDiscardPileTopCard.nLabel === card.nLabel || card.nLabel === 13 || card.nLabel === 14)
      .map(card => card.iCardId);
  }

  /**
   * get list of cards for user to play wrt discard pile top card
   */
  public async handCardCounts(aHand=this.aHand) {
    console.log(this.aHand);
    const nPlayerScore = aHand.reduce((p, c) => p + c.nScore, 0);
    return nPlayerScore
  }
  /**
   * 
   * @param oDiscardPileTopCard 
   * @param eNextCardColor 
   * @returns 
   */
  public async autoPickCard(oTable:Table) {
    log.verbose(`${_.now()} event: autoPickCard, player: ${this.iPlayerId}`);
    const aCard:any =await oTable.drawCard('normal', 1);
    this.emit('resDrawCard', { oData:{oCard: aCard[0]}, nCardCount: 1,nHandCardCount:this.aHand.length+1,nHandScore:await this.handCardCounts() });
    oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, nCardCount: 1,nHandCardCount:this.aHand.length+1 });
  
    await Promise.all([
      oTable.updateDrawPile(),
      this.update({ aHand: [...this.aHand, ...aCard] }),
    ]); 
  }

  /**
   * check if given card is playable or not NOTE :- just for single card only.
   */
  public async checkPlayableCard(oDiscardPileTopCard: ICard, eNextCardColor?: Table['eNextCardColor'],oUserCard?:any) {
    if (oDiscardPileTopCard.nLabel === 12) return oUserCard.nLabel === 12 // TODO check color as well
    if (oDiscardPileTopCard.nLabel === 14) return oUserCard.nLabel === 14
    if (oDiscardPileTopCard.nLabel === 13) return oUserCard.nLabel > 12|| oUserCard.eColor === eNextCardColor
    return oDiscardPileTopCard.eColor === oUserCard.eColor || oDiscardPileTopCard.nLabel === oUserCard.nLabel || oUserCard.nLabel === 13 || oUserCard.nLabel === 14
  }

  // prettier-ignore
  public async takeTurn(oTable: Table) {
    // log.debug(`take turn called... for user ${this.iPlayerId}`);
    await oTable.update({ iPlayerTurn: this.iPlayerId });
    const aPlayableCardId = await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
    log.debug(`${_.now()} discard pile top card:: ${oTable.getDiscardPileTopCard().iCardId}`);
    log.debug(`${_.now()} playable cards for player ${this.iPlayerId}:: ${aPlayableCardId}`);
    this.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nTurnTime, timestamp: Date.now(), aPlayableCards: aPlayableCardId });
    oTable.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nTurnTime, timestamp: Date.now(), aPlayableCards: [] }, [this.iPlayerId]);
    oTable.setSchedular('assignTurnTimerExpired', this.iPlayerId, oTable.toJSON().oSettings.nTurnTime);
  }

  // prettier-ignore
  public async assignTurnTimerExpired(oTable: Table) {
    // log.verbose('assignTurnTimerExpired called...');
    if (this.nGraceTime < 3) return this.assignGraceTimerExpired(oTable); // Nothing changed in table so no need to save it. // ? why
    const aPlayableCardId = await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
    // this.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nGraceTime, timestamp: Date.now(), aPlayableCards: aPlayableCardId });
    // oTable.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nGraceTime, timestamp: Date.now(), aPlayableCards: []  }, [this.iPlayerId]);
    this.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: this.nGraceTime, timestamp: Date.now(), aPlayableCards: aPlayableCardId });
    oTable.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: this.nGraceTime, timestamp: Date.now(), aPlayableCards: []  }, [this.iPlayerId]);
    oTable.setSchedular('assignGraceTimerExpired', this.iPlayerId, this.toJSON().nGraceTime);
    return true;
  }

  public async assignGraceTimerExpired(oTable: Table) {
    // log.verbose('assignGraceTimerExpired called...');
    await this.update({ nMissedTurn: this.nMissedTurn + 1, nGraceTime: 0 });
    /**
     * TODO : kick process for player if missed turn is more than 3 times.
     * Auto collect card if user has no playable cards in hand.
     */
    if(oTable.toJSON().oSettings.bAutoPickCard){
      const aPlayableCardId = await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
      if(!aPlayableCardId.length)this.autoPickCard(oTable)
    }
    oTable.emit('resTurnMissed', { iPlayerId: this.iPlayerId,nMissedTurn:this.nMissedTurn});
    return this.passTurn(oTable);
  }

  public async passTurn(oTable: Table) {
    // log.verbose('passTurn called...');
    if (oTable.toJSON().eState !== 'running') return log.error('table is not in running state.');
    const { aPlayer } = oTable.toJSON();

    const aPlayingPlayer = aPlayer.filter(p => p.eState === 'playing');
    if (!aPlayingPlayer.length) return (log.error('no playing participant') && null) ?? false; // TODO: declare result
    const oNextPlayer = await oTable.getNextPlayer(this.nSeat);
    if (!oNextPlayer) return (log.error('No playing player found...') && null) ?? false;
    oNextPlayer.takeTurn(oTable);
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
      aHand: this.aHand,
      eState: this.eState,
      dCreatedAt: this.dCreatedAt,
    };
  }
}

export default Service;
