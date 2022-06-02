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
