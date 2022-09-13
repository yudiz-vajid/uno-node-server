/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
import os from 'os';
import * as shell from 'shelljs';
import { readFile } from 'fs/promises';
import { Logger } from 'lib-pathfinder-node';
import zookeeper from 'node-zookeeper-client';
import { ZOOKEEPER, MESSAGES, CONFIG_FILE_PATH, SERVICE_NAME, PM2_ERRORS } from '../constants';

let zkClient: any = null;
let configData: any = null;

function getConfig() {
  return configData;
}

/**
 * check if path exists
 * i.e, Check the existence of a node
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
 * Retrieve the data and the stat of the node of the given path
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
 * @param {Object} event
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

  shell.exec('pm2 stop -s uno || :', function (code, output) {
    Logger.debug('Exit code and Program output:', code, output);
  });
  process.exit(0);
}

// verify json config with service name and cluster type extracted from hostname
// eslint-disable-next-line consistent-return
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
      // error in retrieving file
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
  const serverConfigPath = ZOOKEEPER.SERVER_CONFIG_PATH;

  zkClient = zookeeper.createClient(zkIps);
  zkClient.connect();

  function promiseCB(resolve: any, reject: any) {
    async function onConnectCB() {
      Logger.info(MESSAGES.ZOOKEEPER.CONNECTION_ESTABLISHED);

      / check existence of node /;
      const paths = await Promise.all([doesPathExists(serverConfigPath)]).catch(reject);
      let serverConfigData: any = null;

      if (paths[0]) {
        / retrieve data from node /;
        serverConfigData = await getNodeData(serverConfigPath).catch(reject);
        serverConfigData = serverConfigData || {};
      }

      const updatedServerConfigData = serverConfigData; // for testing
      // TODO: remove & uncomment
      // const updatedServerConfigData = await verifyConfig(serverConfigData);

      configData = Object.freeze({
        ...updatedServerConfigData,
      });

      resolve(configData);
    }

    return zkClient.once(MESSAGES.ZOOKEEPER.CONNECTED, onConnectCB);
  }

  return new Promise(promiseCB);
}

const exportObject = {
  init,
  getConfig,
};

export = exportObject;
