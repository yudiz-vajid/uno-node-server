/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import Deck from '../../util/lib/deck';
import { ITable, ISettings, IPlayer, Card } from '../../../types/global';
import Player from '../player';

class Service {
  private iBattleId: string;

  private iPlayerTurn: string;

  private iSkippedPLayer: string;

  private aPlayerIds: string[];

  private aDrawPile: Card[]; // ICard[];

  private bToSkip: boolean;

  private eState: 'waiting' | 'initialized' | 'running' | 'finished';

  private eTurnDirection: 'clockwise' | 'counter-clockwise';

  private eNextCardColor: '';

  private nDrawCount: number;

  private dCreatedDate: Date;

  private oSettings: ISettings;

  private aParticipant: IPlayer[] = [];

  constructor(oData: ITable) {
    this.iBattleId = oData.iBattleId;
    this.iPlayerTurn = oData.iPlayerTurn;
    this.iSkippedPLayer = oData.iSkippedPLayer;
    this.aPlayerIds = oData.aPlayerIds;
    this.aDrawPile = Deck.aDeck;
    this.bToSkip = oData.bToSkip;
    this.eState = oData.eState;
    this.eTurnDirection = oData.eTurnDirection;
    this.eNextCardColor = oData.eNextCardColor;
    this.nDrawCount = oData.nDrawCount;
    this.dCreatedDate = oData.dCreatedDate;
    this.oSettings = oData.oSettings;
  }

  public distributeCards() {
    return Deck.aDeck.slice(0, 7);
  }

  public async save() {
    const sResponse = await redis.client.json.set(_.getTableKey(this.iBattleId), '.', this.toJSON());
    if (!sResponse) return false;
    return true;
  }

  public async getPlayer(iPlayerId: string) {
    const oPlayerData: any = await redis.client.json.get(_.getPlayerKey(this.iBattleId, iPlayerId));
    if (!oPlayerData) return null;
    return new Player(oPlayerData);
  }

  public async addParticipant() {}

  private toJSON(): any {
    return {
      iBattleId: this.iBattleId,
      iPlayerTurn: this.iPlayerTurn,
      iSkippedPLayer: this.iSkippedPLayer,
      aPlayerIds: this.aPlayerIds,
      aDrawPile: this.aDrawPile,
      bToSkip: this.bToSkip,
      eState: this.eState,
      eTurnDirection: this.eTurnDirection,
      eNextCardColor: this.eNextCardColor,
      nDrawCount: this.nDrawCount,
      dCreatedDate: this.dCreatedDate,
      oSettings: this.oSettings,
      aParticipant: this.aParticipant,
    };
  }
}

export default Service;
