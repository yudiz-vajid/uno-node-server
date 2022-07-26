import MESSAGES from './messages';
import ZOOKEEPER from './zookeeper';
import CONFIG from './config';

const exportObject = Object.freeze({
  SERVICE_NAME: 'service-uno',
  GENERAL_CLUSTER: 'general',
  PM2_ERRORS: {
    KEY_NOT_FOUND: 'KEY_NOT_FOUND',
    KEY_MISMATCHED: 'KEY_MISMATCHED',
    HOSTNAME_MISMATCHED: 'HOSTNAME_MISMATCHED',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    FILE_EMPTY: 'FILE_EMPTY',
    OTHER: 'OTHER',
    KEYS: {
      SCHEDULER_REDIS_HOST: 'SCHEDULER_REDIS_HOST',
      PUBSUB_REDIS_HOST: 'PUBSUB_REDIS_HOST',
      GAMEPLAY_REDIS_HOST: 'GAMEPLAY_REDIS_HOST',
    },
  },
  CONFIG_FILE_PATH: '/opt/service-config/config.json',
  COUNTRY: 'IN',
  PRODUCTION: 'production',
  MESSAGES,
  ZOOKEEPER,
  GAME_TYPE: 'callbreak',
  CALLBREAK: 'CB',
  EMPTY: '',
  CB: 'CB',
  INSTRUMENTATION_EVENTS: {
    USER_PLAYED_GAME: 'User Played Game',
    USER_GAME_REJOINED: 'User Game Rejoined',
    USER_TABLE_EXITED: 'User Table Exited',
    USER_TABLE_JOINED: 'User Table Joined',
    USER_GAME_STATUS_CHANGED: 'User Game Status Changed',
    USER_CARD_RESHUFFLED: 'User Card Reshuffled',
    USER_PLAYED_CB: 'User Played CB',
    USER_INVALID_CARD_THROWN: 'User Invalid Card Thrown',
  },
  CONFIG,
});

export = exportObject;
