import PathFinder, { PFServer } from 'lib-pathfinder-node';
import protos from './protos';
import grpc, { getGrpcClient } from './connection/grpc';
import { init, getConfig, getHostWithPort, getHostWithPortOnly } from './connection/zk';

const loadOpts = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

async function setUpEnvs() {
  log.info('fetching ZKConfig ...');
  const ZKConfig = getConfig();

  // TODO : verify
  process.env.PUBSUB_REDIS_HOST = ZKConfig.pubsub.redis.host ?? 'redis-14966.c264.ap-south-1-1.ec2.cloud.redislabs.com';
  process.env.PUBSUB_REDIS_PORT = ZKConfig.pubsub.redis.host ?? '14966';
  process.env.PUBSUB_REDIS_PASSWORD = ZKConfig.pubsub.redis.password ?? 'YYF9EYtDplvfU1RB8icxtGTYooswpTyr';
  process.env.PUBSUB_REDIS_USERNAME = ZKConfig.pubsub.redis.username ?? 'default';

  process.env.GAMEPLAY_REDIS_HOST = ZKConfig.gameplay.redis.host ?? 'redis-14966.c264.ap-south-1-1.ec2.cloud.redislabs.com';
  process.env.GAMEPLAY_REDIS_PORT = ZKConfig.gameplay.redis.host ?? '14966';
  process.env.GAMEPLAY_REDIS_PASSWORD = ZKConfig.gameplay.redis.password ?? 'YYF9EYtDplvfU1RB8icxtGTYooswpTyr';
  process.env.GAMEPLAY_REDIS_USERNAME = ZKConfig.gameplay.redis.username ?? 'default';

  log.info('fetched ZKConfig.');
  log.info(`ZKConfig = ${JSON.stringify(ZKConfig)}\n`);
}

async function startGrpcServer() {
  try {
    const server = new PFServer('service-draw4', 50100);
    await server.start();
  } catch (err: any) {
    log.error(`${_.now()} we have error on addServiceAndStartGrpcServer(), ${err.message}`);
  }
}

export async function initializePathFinder() {
  try {
    PathFinder.initialize({ appName: 'service-draw4', protosToLoad: protos, loadOpts, promisify: true });

    const _zk = await init();
    log.info('PathFinder initialize seq completed.');

    /*
    log.info('gRPC initialize seq started ... ');
    await grpc.init();
    log.info('gRPC initialize seq completed. ');
    */

    setUpEnvs();

    log.info('gRPC server start seq initiated...');
    await startGrpcServer();
    log.info('gRPC server start seq completed.');

    /* AUTH-SERVICE */
    const authClient = await PathFinder.getInstance().getClient({ serviceName: 'service-auth', serviceNameInProto: 'AuthService' });
    console.log('req authenticate');
    const resAuth = await authClient.authenticate().sendMessage({ requestId: '1', authToken: 'admin' });
    console.log('res authenticate ', resAuth);

    /* LOBBY-SERVICE */
    const lobbyClient = await PathFinder.getInstance().getClient({ serviceName: 'service-tournament-1v1', serviceNameInProto: 'LobbyService' });
    console.log('req authenticate');
    const res = await lobbyClient.getLobbyById().sendMessage({ requestId: 'ccaedda7-60b1-4af8-af68-f7eec170ac78', id: 6186650, userId: 1 });
    console.log('res getLobbyById ', res);

    return true;
  } catch (err: any) {
    log.error(`${_.now()} initializePathFinder Failed, ${err.message}`);
    log.info('terminating process ...');
    process.exit(1);
  }
}
