import TableManager from '..';
import { IPlayer, ITable, RedisJSON } from '../../../types/global';

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
  table: any;

  constructor(table: ITable,oData: IPlayer) {
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
    // reference data
    this.table=table
  }

  // prettier-ignore
  public async update(oDate: Partial<Pick<IPlayer, 'sSocketId' | 'nScore' | 'nUnoTime' | 'nGraceTime' | 'nMissedTurn' | 'nDrawNormal' | 'nReconnectionAttempt' | 'bSpecialMeterFull' | 'aHand' | 'eState'>>) {
    try {
      const aPromise: Array<Promise<unknown>> = [];
      const sPlayerKey = _.getPlayerKey(this.iBattleId, this.iPlayerId);
      Object.entries(oDate).forEach(([k, v]) => {
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
    if (this.sSocketId) global.io.to(this.sSocketId).emit(this.iBattleId, _.stringify({ sTaskName: sEventName,oData:{ ...oData} })); // cb not supported while broadcasting
    if (process.env.NODE_ENV !== 'prod') global.io.to(this.sSocketId).emit('postman', _.stringify({ sTaskName: sEventName, oData:{ ...oData} }));
    return true;
  }

/**
 * get discard pile card and check with users hand
 */
 public async getPlayableCards(){
  if(!this.table.aDiscardPile.length)log.error('Discard pile is empty')
  if(!this.aHand.length)log.error('User Hand is empty')
  const oOpenCard=this.table.aDiscardPile[0]
  // { iCardId: 'rd4a', eColor: 'red', nLabel: 4, nScore: 4 }
  const aPlayableCards=this.aHand.filter((card)=>oOpenCard.eColor===card.eColor||oOpenCard.nLabel===card.nLabel||card.nLabel===13||card.nLabel===14).map((c)=>c.iCardId)
  return aPlayableCards
  }


public async takeTurn(){
  /**
   * TODO :- increase take turn for player if required
   * Add playable cards array with user turn.
   */
    log.info('take turn called...')
    const table:any=await TableManager.getTable(this.iBattleId)
    await table.update({ iPlayerTurn: this.iPlayerId });
    const aPlayableCard=await this.getPlayableCards()
    table.emit('resTurnTimer',{bIsGraceTimer:false,iPlayerId:this.iPlayerId,ttl:this.table.oSettings.nTurnTime,timestamp :Date.now(),aPlayableCards:aPlayableCard})
    table.setSchedular('assignTurnTimerExpired', this.iPlayerId,this.table.oSettings.nTurnTime); 
}



  public async assignTurnTimerExpired() {
    log.verbose('assignTurnTimerExpired, assign grace timer');
    if (this.toJSON().nGraceTime < 3) return this.assignGraceTimerExpired(); // Nothing changed in table so no need to save it.
    const aPlayableCard=await this.getPlayableCards()
    this.table.emit('resTurnTimer',{bIsGraceTimer:true,iPlayerId:this.iPlayerId,ttl:this.toJSON().nGraceTime,timestamp :Date.now(),aPlayableCards:aPlayableCard})
    this.table.setSchedular('assignGraceTimerExpired', this.iPlayerId, this.toJSON().nGraceTime); // TODO: replace with nAnimationDelay
    return true;
  }
  
  public async assignGraceTimerExpired(){
      console.log('assignGraceTimerExpired called...');
      this.nGraceTime = 0;
      this.nMissedTurn += 1;
      await this.update({nMissedTurn:this.nMissedTurn})
      // if (this.nMissedTurn < 3)return this.passTurn();
      return this.passTurn();
  }

  public async passTurn() {
    console.log('passTurn called...');
    if (this.table.eState !== 'running') return log.error('table is not in running state.');
    const players=await TableManager.getTablePlayers(this.iBattleId)
    
    const playingPlayers = players.filter((p:any) => p.eState === 'playing');
    /* Not possible case but should be handled both condition */
    if (playingPlayers.length === 0) return log.error('no playing participant'); // return this.table.declareResult(this.iUserId, 'passTurn');
    const nextParticipant = await this.table.getNextParticipant(this.nSeat);    
    if (!nextParticipant) log.verbose('No playing player found...')
    else nextParticipant.takeTurn();
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
