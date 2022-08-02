/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
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
  bDisallowPlayOnDrawCardPenalty: boolean;
  bStackingDrawCards: boolean;
  bMustCollectOnMissTurn: boolean;

  nTotalGameTime: number; // ms : game lifetime
  nFastTimerAt: number; // ms : fast turn timer on given remaining time in nTotalGameTime
  nTurnTime: number; // ms :
  nGraceTime: number; // ms
  nWildCardColorTimer: number; // ms
  nStartingNormalCardCount: number;
  nStartingSpecialCardCount: number;
  nStartingActionCardCount: number;
  nTotalPlayerCount: number;
  nSpecialMeterFillCount: number;
  nGameInitializeTime: number;
  nTotalSkipTurnCount: number;

  aCardScore: Array<number>;
}

export declare interface IPlayer {
  nUsedSpecialCard: any;
  iPlayerId: string;
  iBattleId: string;
  sPlayerName: string;
  sSocketId: string;
  sStartingHand: string;
  nSeat: number;
  nScore: number;
  nGraceTime: number;
  nMissedTurn: number;
  nDrawNormal: number;
  nStartHandSum: number;
  nUsedNormalCard: number;
  nUsedActionCard: number;
  nUsedSpecialCard: number;
  nDrawnNormalCard: number;
  nDrawnSpecialCard: number;
  nSkipUsed: number;
  nReverseUsed: number;
  nDraw2Used: number;
  nDraw4Used: number;
  nWildUsed: number;
  nUnoPressed: number;
  nUnoMissed: number;
  nSkipped: number;
  nDrawn2: number;
  nDrawn4: number;
  nOptionalDraw: number;
  nReconnectionAttempt: number;
  bSpecialMeterFull: boolean;
  bUnoDeclared: boolean;
  bNextTurnSkip: boolean;
  bSkipSpecialMeterProcess: boolean;
  aHand: ICard[];
  eState: 'waiting' | 'disconnected' | 'playing' | 'left' | 'declared';
  dCreatedAt: Date;
}

export declare interface ITable {
  iBattleId: string;
  iLobbyId: string;
  iPlayerTurn: string;
  iSkippedPLayer: string;
  iDrawPenltyPlayerId: string;
  aPlayerId: string[];
  aDrawPile: ICard[];
  aDiscardPile: ICard[];
  bToSkip: boolean;
  bTurnClockwise: boolean;
  bIsReverseNow: boolean;
  eState: 'waiting' | 'initialized' | 'running' | 'finished';
  eNextCardColor: Omit<ICard['eColor'], 'black'>;
  nDrawCount: number;
  oSettings: ISettings;
  oWinningCard: object;
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

/* gRPC response types */
enum IAuthServiceErrorReason {
  NONE = 0,
  UNKNOWN = 1,
  BAD_REQUEST = 2,
  INTERNAL_ERROR = 3,
  INVALID_USER_ID = 4,
}

interface IAuthServiceError {
  reason: IAuthServiceErrorReason;
  message: string;
}

export declare interface IAuthenticationResponse {
  error: IAuthServiceError;
  isAuthentic: boolean;
  userId: number;
  mobileNumber: string;
  countryCode: string;
}

interface ILobbyDetails {
  topRanks: Array<unknown>;
  id: number;
  name: string;
  description: string;
  configId: number;
  startTime: string;
  activeEndTime: string;
  endTime: string;
  gameId: number;
}

interface ICurrency {
  currencyId: string;
  currencyName: string;
  symbol: string;
}

interface ICountryInfo {
  countryCode: string;
  countryName: string;
  currency: ICurrency;
  timeZone: string;
}

interface IUpsellOffer {
  header: string;
  offerText: string;
  endTime: string;
  badgeText: string;
  rewards: Array<unknown>;
  progressText: string;
  visible: boolean;
  imageUrl: string;
  extraInfo: string;
  entryFee: number;
  moneyEntryFee: string;
  countryInfo: ICountryInfo;
}

export declare interface IGetLobbyByIdResponse {
  requestId: string;
  error: IAuthServiceError;
  lobbyDetails: ILobbyDetails;
  gameConfig: Record<string, unknown>;
  currencyType: string;
  entryFee: number;
  rewards: Record<string, unknown>;
  lobbyStatus: string;
  active: boolean;
  extraInfo: Record<string, unknown>;
  createdOn: '';
  modifiedOn: string;
  registeredUsers: number;
  activeUsers: number;
  chatChannel: string;
  minPlayers: number;
  maxPlayers: number;
  userRegistered: boolean;
  gameConfigName: string;
  gameName: string;
  style: string;
  specialRewards: Record<string, unknown>;
  battlePlayAgainDisabled: boolean;
  imageUrl: string;
  applyBonusLimit: boolean;
  bonusLimit: number;
  gameIcon: string;
  upsellOffer: unknown; // UpsellOffer
  moneyEntryFee: string;
  countryInfo: ICountryInfo;
  liveUsers: number;
}

enum ICreateTableResponseReason {
  NONE = 0,
  UNKNOWN = 1,
  BAD_REQUEST = 2,
  INTERNAL_ERROR = 3,
  EXTERNAL_ERROR = 4,
  INSUFFICIENT_FUNDS = 5,
  LOBBY_ENDED = 6,
  VIOLATED_THE_FRAUD_RULES = 7,
  UNAUTHORIZED = 8,
  GAME_WISE_USER_BLOCKED = 9,
  DUPLICATE = 10,
  APP_LEVEL_USER_BLOCKED = 11,
  MIN_VERSION_UPDATE = 12,
  COLLUSION_DETECTED = 13,
  FORMAT_NOT_SUPPORTED = 14,
  KO_DEVICE_ID_CHECK = 15,
  SEGMENT_BLOCKED_USER = 16,
  USER_EXITED_RUMMY_TOURNAMENT = 17,
}
interface ILobbyServiceError {
  reason: ICreateTableResponseReason;
  message: string;
  segmentBlockedUsers: Array<number>;
}
// interface ICreatBattlePlayer {}

export declare interface ICreateTableResponse {
  requestId: string;
  error: ILobbyServiceError;
  success: boolean; // this is imp
  battlePlayers: Array<unknown>;
  currency: ICurrency;
  amount: number;
  allowedBonusAmount: number;
  moneyAmount: string;
  moneyBonusAmount: string;
  countryInfo: ICountryInfo;
  spinAndGoAmount: number;
  isBumperLobby: boolean;
  gameConfig: string;
  randomizedGameConfig: string;
  isBumperLobby1vn: boolean;
  spinAndGoAmount1vn: Array<number>;
}
