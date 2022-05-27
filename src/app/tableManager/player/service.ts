/* eslint-disable class-methods-use-this */
// import Deck from '../../util/lib/deck';
// eslint-disable-next-line import/no-cycle
import Player from '.';
import { Card, IPlayer } from '../../../types/global';

class Service {
  private iPlayerId: string;

  private iBattleId: string;

  private sPlayerName: string;

  private sSocketId: string;

  private nSeat: number;

  private nScore: number;

  private nUnoTime: number;

  private nGraceTime: number;

  private nMissedTurn: number;

  private nDrawNormal: number;

  private nReconnectionAttempt: number;

  private bSpecialMeterFull: boolean;

  private aHand: Card[];

  private eState: 'disconnected' | 'playing' | 'left';

  private dCreatedAt: Date;

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

  public async save() {
    const sResponse = await redis.client.json.set(_.getPlayerKey(this.iBattleId, this.iPlayerId), '.', this.toJSON());
    if (!sResponse) return false;
    return true;
  }

  public async get() {
    const oPlayerData: any = await redis.client.json.get(_.getPlayerKey(this.iBattleId, this.iPlayerId));
    if (!oPlayerData) return null;
    return new Player(oPlayerData);
  }

  async emit(sEventName: string, message: string, oData: any = {}) {
    if (!sEventName) return false;
    if (this.sSocketId) return global.io.to(this.sSocketId).emit(this.iBattleId, message, _.stringify({ sTaskName: sEventName, other: oData })); // cb not supported while broadcasting
    return true;
  }

  private toJSON(): any {
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
  //   async setHand() {}
}

export default Service;
