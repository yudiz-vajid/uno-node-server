import 'dotenv/config';
import './globals';
import path from 'path';
import PathFinder from 'lib-pathfinder-node';
import { PFServer } from 'lib-pathfinder-node';
import protos from './grpc';
import server from './server';
import socket from './app/sockets';

const loadOpts = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

async function startGrpcServer() {

  const server = new PFServer(
    'service-uno',
    50100
  );
  server.addService(
    path.join(__dirname, 'grpc/protos/AuthService.proto'),
  );
  await server.start();
}

async function pathFinderInit() {
  try {
    PathFinder.initialize({ appName: 'Uno', protosToLoad: protos, loadOpts, promisify: true });
    log.info('PathFinder initialized');
    const client = await PathFinder.getInstance().getClient({
      serviceName: 'service-auth',
      serviceNameInProto: 'AuthService',
    });
    log.info('Initiated Client');
    const resp = await client.authenticate().sendMessage({ requestId: 'req_1', authToken: 'authToken_1' });
    console.log('resp', resp);
  } catch (err: any) {
    log.error(`${h.now()} we have error, ${err.message}, ${err.stack}`);
  }
}

(async () => {
  try {
    await startGrpcServer();
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
