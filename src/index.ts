import 'dotenv/config';
import './globals/lib/fetch_ip';
import './globals';
import server from './server';
import socket from './app/sockets';
import protos from './pathFinder/protos';
import { init, getConfig } from './pathFinder/connection/zk';

process.once('uncaughtException', (ex: any) => {
  log.error(`${_.now()} we have uncaughtException, ${ex.message}, ${ex.stack}`);
  process.exit(1);
});

process.once('unhandledRejection', (ex: any) => {
  log.error(`${_.now()} we have unhandledRejection, ${ex.message}, ${ex.stack}`);
  process.exit(1);
});

const loadOpts = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

async function startGrpcServer() {
  PF.initialize({ appName: 'service-uno', protosToLoad: protos, loadOpts, promisify: true });
  await init(); // init ZK
  const ZKConfig = getConfig(); // TODO: setup envs from here
  await startGrpcServer();
}

(async () => {
  try {
    if (process.env.NODE_ENV !== 'dev') await startGrpcServer();
    await Promise.all([server.initialize(), redis.initialize()]);
    await socket.initialize(server.httpServer);
    log.info(':-)');
  } catch (err: any) {
    log.info(':-(');
    log.error(`reason: ${err.message}, stack: ${err.stack}`);
  }
})();
