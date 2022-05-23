import './env';
import './globals';
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

(async () => {
  try {
    await Promise.all([server.initialize(), redis.initialize()]);
    await socket.initialize(server.httpServer);
    log.info(':-)');
  } catch (err: any) {
    log.info(':-(');
    log.error(`reason: ${err.message}, stack: ${err.stack}`);
  }
})();
