export declare interface ICallback {
  // eslint-disable-next-line no-unused-vars
  (message?: Record<string, unknown> | string | boolean): void;
}
export declare interface IEnv {
  BASE_URL: string;
  REDIS_DB: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
}
export declare interface IEnvs {
  [key: string]: IEnv;
}

export declare interface ICard {
  iCardId: string;
  eColor: 'red' | 'green' | 'blue' | 'yellow' | 'black';
  nLabel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14; // - [0-9] -> numbered card, 10 -> skip , 11 -> reverse, 12 -> drawTwo, 13 -> wild, 14 -> wildDrawFour
  nScore: number;

  // CONFIRM: below fields are required ?
  // bSkipCard?: boolean; // play on same color or label
  // bReverseCard?: boolean; // play on same color or label
  // bDrawTwoCard?: boolean; // play on same color or label
  // bDrawFourCard?: boolean; // only for black(wild) card
}

declare interface ISettings {
  bMustCollectOnMissTurn: boolean;
  bSkipTurnOnDrawTwoOrFourCard: boolean;
  bStackingDrawCards: boolean;
  bVisualEffectOnUnoButton: boolean;
  bAutoPickCard: boolean;

  nTotalGameTime: number; // ms : game lifetime
  nTurnTime: number; // ms :
  nGraceTime: number; // ms
  nStartingNormalCardCount: number;
  nStartingSpecialCardCount: number;
  nStartingActionCardCount: number;
  nTotalPlayerCount: number;
  nUnoTime: number;
  nSpecialMeterFillCount: number;
  nGameInitializeTime: number;
  nTotalSkipTurnCount: number;

  aCardScore: Array<number>;
}

export declare interface IPlayer {
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
  bNextTurnSkip: boolean;
  aHand: ICard[];
  eState: 'waiting' | 'disconnected' | 'playing' | 'left';
  dCreatedAt: Date;
}

export declare interface ITable {
  iBattleId: string;
  iPlayerTurn: string;
  iSkippedPLayer: string;
  aPlayerId: string[];
  aDrawPile: ICard[];
  aDiscardPile: ICard[];
  bToSkip: boolean;
  bTurnClockwise: boolean;
  eState: 'waiting' | 'initialized' | 'running' | 'finished';
  eNextCardColor: Omit<ICard['eColor'], 'black'>;
  nDrawCount: number;
  oSettings: ISettings;
  dCreatedAt: Date;
}

export declare interface ITableWithPlayer extends ITable {
  aPlayer: Array<IPlayer>;
}

/* for json casting while saving to redis */
// eslint-disable-next-line no-use-before-define
export declare type RedisJSON = null | boolean | number | string | Date | RedisJSONArray | RedisJSONObject;
type RedisJSONArray = Array<RedisJSON>;
interface RedisJSONObject {
  [key: string]: RedisJSON;
  [key: number]: RedisJSON;
}
