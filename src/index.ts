import 'dotenv/config';
import './globals';
import server from './server';
import socket from './app/sockets';
import { initializePathFinder } from './pathFinder';

(async () => {
  try {
    if(! await initializePathFinder()) throw new Error('PathFinder Error');
    await Promise.all([server.initialize(), redis.initialize()]);
    await socket.initialize(server.httpServer);
    log.info(`[HOST: ${process.env.HOST}]  we have initialized everything`);
    // await redis.client.flushAll(); // TODO: remove
    log.info(`:-)`);
  } catch (err: any) {
    log.error(`${h.now()} ${err.message}`);
    log.info(':-(');
    process.exit(1);
  }
})();
