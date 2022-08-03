/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import PathFinder, { PFServer } from 'lib-pathfinder-node';
import protos from './protos';
import { init, getConfig } from './connection/zk';
// import grpc, { getGrpcClient } from './connection/grpc';

const loadOpts = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

async function setUpEnvs() {
  process.env.NODE_ENV ??= 'qa';
  process.env.PORT ??= '3000';
  process.env.LOG_LEVEL ??= 'silly';

  log.info('fetching ZKConfig ...');
  const ZKConfig: Record<string, string> | null = process.env.NODE_ENV !== 'dev' ? getConfig() : null;

  process.env.PUBSUB_REDIS_HOST = ZKConfig?.PUBSUB_REDIS_HOST ?? 'redis-14966.c264.ap-south-1-1.ec2.cloud.redislabs.com';
  process.env.PUBSUB_REDIS_PORT = ZKConfig?.PUBSUB_REDIS_PORT ?? '14966';
  process.env.PUBSUB_REDIS_PASSWORD = ZKConfig?.PUBSUB_REDIS_PASSWORD ?? 'YYF9EYtDplvfU1RB8icxtGTYooswpTyr';
  process.env.PUBSUB_REDIS_USERNAME = ZKConfig?.PUBSUB_REDIS_USERNAME ?? 'default';

  process.env.GAMEPLAY_REDIS_HOST = ZKConfig?.GAMEPLAY_REDIS_HOST ?? 'redis-14966.c264.ap-south-1-1.ec2.cloud.redislabs.com';
  process.env.GAMEPLAY_REDIS_PORT = ZKConfig?.GAMEPLAY_REDIS_PORT ?? '14966';
  process.env.GAMEPLAY_REDIS_PASSWORD = ZKConfig?.GAMEPLAY_REDIS_PASSWORD ?? 'YYF9EYtDplvfU1RB8icxtGTYooswpTyr';
  process.env.GAMEPLAY_REDIS_USERNAME = ZKConfig?.GAMEPLAY_REDIS_USERNAME ?? 'default';

  process.env.SCHEDULER_REDIS_HOST = ZKConfig?.SCHEDULER_REDIS_HOST ?? 'redis-14966.c264.ap-south-1-1.ec2.cloud.redislabs.com';
  process.env.SCHEDULER_REDIS_PORT = ZKConfig?.SCHEDULER_REDIS_PORT ?? '14966';
  process.env.SCHEDULER_REDIS_PASSWORD = ZKConfig?.SCHEDULER_REDIS_PASSWORD ?? 'YYF9EYtDplvfU1RB8icxtGTYooswpTyr';
  process.env.SCHEDULER_REDIS_USERNAME = ZKConfig?.SCHEDULER_REDIS_USERNAME ?? 'default';

  log.info('fetched ZKConfig.');
  log.info(`ZKConfig = ${JSON.stringify(ZKConfig)}\n`);
  // log.info(`process.env = ${JSON.stringify(process.env)}\n`);
}

async function startGrpcServer() {
  try {
    const server = new PFServer('service-uno', 50100);
    await server.start();
  } catch (err: any) {
    log.error(`${_.now()} we have error on addServiceAndStartGrpcServer(), ${err.message}`);
  }
}

export async function initializePathFinder() {
  try {
    setUpEnvs();
    if (process.env.NODE_ENV === 'dev') return true;

    PathFinder.initialize({ appName: 'service-uno', protosToLoad: protos, loadOpts, promisify: true });
    await init();
    log.info('PathFinder initialize seq completed.');

    /*
    log.info('gRPC initialize seq started ... ');
    await grpc.init();
    log.info('gRPC initialize seq completed. ');
    */

    log.info('gRPC server start seq initiated...');
    await startGrpcServer();
    log.info('gRPC server start seq completed.');

    // /* AUTH-SERVICE */
    // const authClient = await PathFinder.getInstance().getClient({ serviceName: 'service-auth', serviceNameInProto: 'AuthService' });
    // console.log('req authenticate');
    // const resAuth = await authClient.authenticate().sendMessage({ requestId: '1', authToken: 'admin' });
    // console.log('res authenticate ', resAuth);

    // /* LOBBY-SERVICE */
    // const lobbyClient = await PathFinder.getInstance().getClient({ serviceName: 'service-tournament-1v1', serviceNameInProto: 'LobbyService' });
    // console.log('req authenticate');
    // const res = await lobbyClient.getLobbyById().sendMessage({ requestId: 'ccaedda7-60b1-4af8-af68-f7eec170ac78', id: 6186650, userId: 1 });
    // console.log('res getLobbyById ', res);

    return true;
  } catch (err: any) {
    log.error(`${_.now()} initializePathFinder Failed, ${err.message}`);
    log.info('terminating process ...');
    process.exit(1);
  }
}
