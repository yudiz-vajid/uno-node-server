declare interface IEnv {
  BASE_URL: string;
  REDIS_DB: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
}
declare interface IEnvs {
  [key: string]: IEnv;
}

declare interface ICard {
  iCardId: string;
  eColor: 'red' | 'green' | 'blue' | 'yellow' | 'black';
  nLabel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  nScore: number;
  bSkipCard: boolean; // play on same color or label
  bReverseCard: boolean; // play on same color or label
  bDrawTwoCard: boolean; // play on same color or label
  bDrawFourCard: boolean; // only for black(wild) card
}

declare interface Card {
  nLabel: any;
  eColor: any;
  nScore: any;
  _id: any;
}

declare interface ISettings {
  bMustCollectOnMissTurn: boolean | null;
  nUnoTime: number | null;
  nTurnMissLimit: number | null;
  nGraceTime: number | null; // ms
  nTurnTime: number | null; // ms
  nStartGameTime: number | null; // ms
  aCardScore: { iCardId: string; nScore: string }[];
}

declare interface ITable {
  iBattleId: string;
  iPlayerTurn: string;
  iSkippedPLayer: string;
  aPlayerIds: string[];
  aDrawPile: ICard[];
  bToSkip: boolean;
  eState: 'waiting' | 'initialized' | 'running' | 'finished';
  eTurnDirection: 'clockwise' | 'counter-clockwise';
  eNextCardColor: '';
  nDrawCount: number;
  dCreatedDate: Date;
  oSettings: ISettings;
}

declare interface IPlayer {
  iPlayerId: string;
  iBattleId: string;
  sPlayerName: string;
  sSocketId: string;
  nSeat: number;
  nScore: number;
  nUnoTime: number;
  nGraceTime: number;
  nMissedTurn: number;
  nDrawNormal: number;
  nReconnectionAttempt: number;
  bSpecialMeterFull: boolean;
  aHand: Card[]; // TODO: replace with ICard
  eState: 'waiting' | 'disconnected' | 'playing' | 'left';
  dCreatedAt: Date;
}

export { IEnv, IEnvs, ICard, ISettings, ITable, IPlayer, Card }; // TODO : remove Card
