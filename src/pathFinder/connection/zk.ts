import os from 'os';
import * as shell from 'shelljs';
import { readFile } from 'fs/promises';
import { Logger } from 'lib-pathfinder-node';
import zookeeper from 'node-zookeeper-client';
import { currentIndexForServicesOfGRPC } from '../modules';
import { ZOOKEEPER, MESSAGES, CONFIG_FILE_PATH, SERVICE_NAME, GENERAL_CLUSTER, PM2_ERRORS } from '../constants';

const hostObj: any = {};
let counter = 50;
let zkClient: any = null;
let configData: any = null;

function getConfig() {
  return configData;
}

/**
 * check if path exists
 * @param {String} zkPath
 * @returns {Boolean}
 */
async function doesPathExists(path: any) {
  function promiseCB(resolve: any, reject: any) {
    function zookeeperCB(error: any, data: any) {
      if (error) {
        Logger.error('Node finding error', error.stack);
        reject(false);
      }

      if (!data) {
        Logger.error('Node does not exist.');
        reject(false);
      }
      resolve(true);
    }

    zkClient.exists(path, zookeeperCB);
  }

  return new Promise(promiseCB);
}

/**
 * Get the data from path
 * @param {Object} event
 */
const getNodeData = async (path: any) => {
  function promiseCB(resolve: any, reject: any) {
    function getDataCB(error: any, data: any) {
      if (error) {
        Logger.error('get config path error: ', error.stack);
        reject(false);
      }

      if (data && Object.keys(data).length === 0) {
        Logger.warn('get config path >> data null');
        reject(false);
      }

      resolve(JSON.parse(data));
    }

    // eslint-disable-next-line no-use-before-define
    zkClient.getData(path, onZKConfigChange, getDataCB);
  }

  return new Promise(promiseCB);
};

/**
 * Config change event listener
 * @param {Objecr} event
 */
async function onZKConfigChange(event: any) {
  Logger.info(MESSAGES.ZOOKEEPER.NEW_EVENT);

  const { path } = event;

  const nodeData: any = await getNodeData(path);

  configData = { ...configData, ...nodeData };
  for (const key in configData) {
    if (Object.hasOwnProperty.call(configData, key)) {
      configData[key] = nodeData[key];
    }
  }

  Logger.info(`${MESSAGES.ZOOKEEPER.NEW_DATA_EVENT} ${path}`);
}

function stopPm2(reason: string, key?: string) {
  switch (reason) {
    case PM2_ERRORS.KEY_NOT_FOUND:
      Logger.error(
        `${key} not found in ${CONFIG_FILE_PATH}.
          Server configuration Mismatch. Please validate redis and server configuration`
      );
      break;
    case PM2_ERRORS.HOSTNAME_MISMATCHED:
      Logger.error(
        `Hostname does not have ${SERVICE_NAME} in it.
          Server configuration Mismatch. Please validate redis and server configuration`
      );
      break;
    case PM2_ERRORS.KEY_MISMATCHED:
      Logger.error(
        `${key} of ${CONFIG_FILE_PATH} does not have service name and cluster type.
          Server configuration Mismatch. Please validate redis and server configuration`
      );
      break;
    case PM2_ERRORS.FILE_NOT_FOUND:
      Logger.error(
        `error in retiriving ${CONFIG_FILE_PATH} file.
          Server configuration Mismatch. Please validate redis and server configuration`
      );
      break;
    case PM2_ERRORS.FILE_EMPTY:
      Logger.error(
        `${CONFIG_FILE_PATH} is empty file....
          Server configuration Mismatch. Please validate redis and server configuration`
      );
      break;
    default:
      Logger.error(`Server configuration Mismatch. Please validate redis and server configuration`);
  }

  shell.exec('pm2 stop -s callbreak || :', function (code, output) {
    Logger.debug('Exit code and Program output:', code, output);
  });
  process.exit(0);
}

// verify json config with service name and cluster type extracted from hostname
async function verifyConfig(serverConfigData: any) {
  try {
    let serverConfig: any = null;
    const hostname = os.hostname();
    Logger.debug('serviceName and hostname:', SERVICE_NAME, hostname);
    let clusterType = '';

    try {
      // extract cluster type from hostname
      clusterType = hostname.split(`${SERVICE_NAME}`)[1].split(`-`)[1];
      Logger.debug('cluster type...', hostname.split(`${SERVICE_NAME}`)[1].split(`-`)[1]);
    } catch (e) {
      stopPm2(PM2_ERRORS.HOSTNAME_MISMATCHED);
    }

    // if cluster is not general, check redis urls from config else ignore
    serverConfig = await readFile(CONFIG_FILE_PATH).catch(e => {
      // error in retirving file
      stopPm2(PM2_ERRORS.FILE_NOT_FOUND);
    });

    serverConfig = serverConfig || {};
    if (!serverConfig.toString()) {
      // file is empty
      stopPm2(PM2_ERRORS.FILE_EMPTY);
    }
    const serverConfigJsonObj = JSON.parse(serverConfig.toString());

    const re = new RegExp(`${SERVICE_NAME}-${clusterType}`);

    // check SCHEDULER_REDIS_HOST if exist and is matched with regex
    if (!serverConfigJsonObj.SCHEDULER_REDIS_HOST) {
      stopPm2(PM2_ERRORS.KEY_NOT_FOUND, PM2_ERRORS.KEYS.SCHEDULER_REDIS_HOST);
    } else if (!re.test(serverConfigJsonObj.SCHEDULER_REDIS_HOST)) {
      stopPm2(PM2_ERRORS.KEY_MISMATCHED, PM2_ERRORS.KEYS.SCHEDULER_REDIS_HOST);
    } else {
      Logger.debug(`SCHEDULER_REDIS_HOST of ${CONFIG_FILE_PATH} : ${serverConfigJsonObj.SCHEDULER_REDIS_HOST} matched with regex : ${re}`);
    }

    // check PUBSUB_REDIS_HOST if exist and is matched with regex
    if (!serverConfigJsonObj.PUBSUB_REDIS_HOST) {
      stopPm2(PM2_ERRORS.KEY_NOT_FOUND, PM2_ERRORS.KEYS.PUBSUB_REDIS_HOST);
    } else if (!re.test(serverConfigJsonObj.PUBSUB_REDIS_HOST)) {
      stopPm2(PM2_ERRORS.KEY_MISMATCHED, PM2_ERRORS.KEYS.PUBSUB_REDIS_HOST);
    } else {
      Logger.debug(`PUBSUB_REDIS_HOST of ${CONFIG_FILE_PATH} : ${serverConfigJsonObj.PUBSUB_REDIS_HOST} matched with regex : ${re}`);
    }

    // check GAMEPLAY_REDIS_HOST if exist and is matched with regex
    if (!serverConfigJsonObj.GAMEPLAY_REDIS_HOST) {
      stopPm2(PM2_ERRORS.KEY_NOT_FOUND, PM2_ERRORS.KEYS.GAMEPLAY_REDIS_HOST);
    } else if (!re.test(serverConfigJsonObj.GAMEPLAY_REDIS_HOST)) {
      stopPm2(PM2_ERRORS.KEY_MISMATCHED, PM2_ERRORS.KEYS.GAMEPLAY_REDIS_HOST);
    } else {
      Logger.debug(`GAMEPLAY_REDIS_HOST of ${CONFIG_FILE_PATH} : ${serverConfigJsonObj.GAMEPLAY_REDIS_HOST} matched with regex : ${re}`);
    }

    // override ZK redis url with redis urls from json  if all matches and return
    serverConfigData.SCHEDULER_REDIS_HOST = serverConfigJsonObj.SCHEDULER_REDIS_HOST;
    serverConfigData.SCHEDULER_REDIS_PORT = serverConfigJsonObj.SCHEDULER_REDIS_PORT;
    serverConfigData.SCHEDULER_REDIS_PASSWORD = serverConfigJsonObj.SCHEDULER_REDIS_PASSWORD;

    serverConfigData.PUBSUB_REDIS_HOST = serverConfigJsonObj.PUBSUB_REDIS_HOST;
    serverConfigData.PUBSUB_REDIS_PORT = serverConfigJsonObj.PUBSUB_REDIS_PORT;
    serverConfigData.PUBSUB_REDIS_PASSWORD = serverConfigJsonObj.PUBSUB_REDIS_PASSWORD;

    serverConfigData.GAMEPLAY_REDIS_HOST = serverConfigJsonObj.GAMEPLAY_REDIS_HOST;
    serverConfigData.GAMEPLAY_REDIS_PORT = serverConfigJsonObj.GAMEPLAY_REDIS_PORT;
    serverConfigData.GAMEPLAY_REDIS_PASSWORD = serverConfigJsonObj.GAMEPLAY_REDIS_PASSWORD;

    return serverConfigData;
  } catch (e) {
    Logger.error('CATCH_ERROR in verifyConfig ', e);
    stopPm2(PM2_ERRORS.OTHER);
  }
}

async function init() {
  const zkIps = ZOOKEEPER.IPs;
  const serverConfigPath = ZOOKEEPER.DB_CONFIG_PATH;
  const productConfigPath = ZOOKEEPER.GAME_CONFIG_PATH;
  const messageConfigPath = ZOOKEEPER.MSG_CONFIG_PATH;

  // TODO: remove
  Logger.debug('zkIps:', zkIps);
  Logger.debug('serverConfigPath:', serverConfigPath);
  Logger.debug('productConfigPath:', productConfigPath);
  Logger.debug('messageConfigPath:', messageConfigPath);
  // TODO: remove

  zkClient = zookeeper.createClient(zkIps);
  zkClient.connect();

  function promiseCB(resolve: any, reject: any) {
    async function onConnectCB() {
      Logger.info(MESSAGES.ZOOKEEPER.CONNECTION_ESTABLISHED);

      const paths = await Promise.all([doesPathExists(serverConfigPath), doesPathExists(productConfigPath), doesPathExists(messageConfigPath)]).catch(reject);

      let serverConfigData: any = null;
      let productConfigData: any = null;
      let messageConfigData: any = null;

      if (paths[0]) {
        serverConfigData = await getNodeData(serverConfigPath).catch(reject);
        serverConfigData = serverConfigData || {};
      }
      if (paths[1]) {
        productConfigData = await getNodeData(productConfigPath).catch(reject);
        productConfigData = productConfigData || {};
      }
      if (paths[2]) {
        messageConfigData = await getNodeData(messageConfigPath).catch(reject);
        messageConfigData = messageConfigData || {};
      }

      // TODO: remove
      Logger.debug('paths:', paths);
      Logger.debug('\nserverConfigData:', serverConfigData);
      Logger.debug('\nproductConfigData:', productConfigData);
      Logger.debug('\nmessageConfigData:', messageConfigData);
      // TODO: remove

      const updatedServerConfigData = await verifyConfig(serverConfigData);
      // TODO: remove
      Logger.debug('\nupdatedServerConfigData:', updatedServerConfigData);
      // TODO: remove

      // TODO: add joi validation check here
      configData = Object.freeze({
        ...updatedServerConfigData,
        ...productConfigData,
        ...messageConfigData,
      });

      // TODO: remove
      Logger.debug('\nconfigData:', configData);
      // TODO: remove

      resolve(configData);
    }

    return zkClient.once(MESSAGES.ZOOKEEPER.CONNECTED, onConnectCB);
  }

  // TODO: remove
  // Logger.debug('zkClient:', zkClient);
  Logger.debug('returning connection listener (promisified)');
  // TODO: remove
  // connection listener promisify
  return new Promise(promiseCB);
}

// TO BE CHANGED IN FUTURE
const getNewIndexValue = (currentIndex: any, hosts: any) => {
  let newIndex = currentIndex + 1;
  if (newIndex >= hosts.length) {
    newIndex = 0;
  }
  return newIndex;
};

// TO BE CHANGED IN FUTURE
const getHostName: any = async (currentIndex: any, hosts: any, servicePath: any) => {
  const newIndex = await getNewIndexValue(currentIndex, hosts);
  if (hosts[newIndex].status !== 'ONLINE') {
    counter -= 1;
    if (counter === 0) {
      Logger.error(`All the servers are offline ${JSON.stringify(hosts)}`);
      return false;
    }

    return getHostName(newIndex, hosts, servicePath);
  }

  counter = 50;
  currentIndexForServicesOfGRPC[servicePath] = newIndex;
  return hosts[newIndex].hostname;
};

// TO BE CHANGED IN FUTURE
const getCurrentIndex = (servicePath: any) => {
  if (currentIndexForServicesOfGRPC[servicePath] || currentIndexForServicesOfGRPC[servicePath] === 0) {
    return currentIndexForServicesOfGRPC[servicePath];
  }

  currentIndexForServicesOfGRPC[servicePath] = 0;
  return 0;
};

// TO BE CHANGED IN FUTURE
const getHostWithPortOnly = async (servicePath: any) => {
  const currentIndex = await getCurrentIndex(servicePath);
  const newHostName = await getHostName(currentIndex, hostObj.hosts, servicePath);
  const port = hostObj.defaultPort;
  return `${newHostName}:${port}`;
};

// TO BE CHANGED IN FUTURE
const getHostWithPort = (servicePath: any) => {
  zkClient.getData(
    `/service-registry/${servicePath}`,
    async (event: any) => {
      Logger.info('servicePath data updated event >> ', event, event.path); // Got event: /service-registry/service-tournament-1v1.
      await getHostWithPort(servicePath);
    },
    async (error: any, data: any, stat: any) => {
      if (error) {
        Logger.error('get servicePath error: ', error.stack);
        return false;
      }

      // hostObj = JSON.parse(data.toString());
      const url = await getHostWithPortOnly(servicePath);
      return url;
    }
  );
};

const exportObject = {
  init,
  getConfig,
  getHostWithPort,
  getHostWithPortOnly,
};

export = exportObject;
