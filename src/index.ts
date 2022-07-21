import 'dotenv/config';
import './globals';
import PathFinder from 'lib-pathfinder-node';
import protos from './grpc';
import server from './server';
import socket from './app/sockets';

process.env.UV_THREADPOOL_SIZE = '1';

process.once('uncaughtException', (ex: any) => {
  log.error(`${_.now()} we have uncaughtException, ${ex.message}, ${ex.stack}`);
  process.exit(1);
});

process.once('unhandledRejection', (ex: any) => {
  log.error(`${_.now()} we have unhandledRejection, ${ex.message}, ${ex.stack}`);
  process.exit(1);
});

async function pathFinderInit() {
  try {
    PathFinder.initialize({ appName: 'Uno', protosToLoad: protos, promisify: true });

    const client = await PathFinder.getInstance().getClient({
      serviceName: 'AuthService',
      serviceNameInProto: 'AuthService',
    });

    client.authenticate({
      requestId: 'req_1',
      authToken: 'authToken_1',
    });
  } catch (err: any) {
    log.error(`${_.now()} we have error, ${err.message}, ${err.stack}`);
  }
}

(async () => {
  try {
    await Promise.all([server.initialize(), redis.initialize()]);
    await socket.initialize(server.httpServer);
    log.info(`[HOST: ${process.env.HOST}]  we have initialized everything`);
    await redis.client.flushAll(); // TODO: remove
    pathFinderInit();
    log.info(`:-)`);
  } catch (err: any) {
    log.info(':-(');
    log.error(`reason: ${err.message}, stack: ${err.stack}`);
  }
})();
