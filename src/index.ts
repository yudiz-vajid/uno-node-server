import { cpus } from 'os';
// import 'dotenv/config';
import './globals';
import server from './server';
import socket from './app/sockets';
import { initializePathFinder } from './pathFinder';
import { RedisClient, getIp } from './app/util';


process.env.UV_THREADPOOL_SIZE = `${cpus().length}`;

(async () => {
  try {
    await initializePathFinder();
    global.redis = new RedisClient();
    await Promise.all([server.initialize(), redis.initialize()]);
    await socket.initialize(server.httpServer);
    await getIp()
    log.info(':-)');
  } catch (err: any) {
    log.info(':-(');
    log.error(`reason: ${err.message}, stack: ${err.stack}`);
  }
})();

process.once('uncaughtException', (ex: any) => {
  log.error(`${_.now()} we have uncaughtException, ${ex.message}, ${ex.stack}`);
  process.exit(1);
});

process.once('unhandledRejection', (ex: any) => {
  log.error(`${_.now()} we have unhandledRejection, ${ex.message}, ${ex.stack}`);
  process.exit(1);
});
