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

async function startGrpcServer() {
  try {
    const server = new PFServer('service-uno', 50100);
    await server.start();
  } catch (err: any) {
    log.error(`${h.now()} we have error on addServiceAndStartGrpcServer(), ${err.message}`);
  }
}

export async function initializePathFinder() {
  try {
    PathFinder.initialize({ appName: 'service-uno', protosToLoad: protos, loadOpts, promisify: true });

    log.info('gRPC server start seq initiated...');
    await startGrpcServer();
    log.info('gRPC server start seq completed.');

    /* AUTH-SERVICE */
    const authClient = await PathFinder.getInstance().getClient({ serviceName: 'service-auth', serviceNameInProto: 'AuthService' });
    console.log('req authenticate', authClient);
    const resAuth = await authClient.authenticate().sendMessage({ requestId: '1', authToken: 'admin' });
    console.log('res authenticate ', resAuth);

    /* LOBBY-SERVICE */
    const lobbyClient = await PathFinder.getInstance().getClient({ serviceName: 'service-lobby', serviceNameInProto: 'LobbyService' });
    console.log('req authenticate', lobbyClient);
    const res = await lobbyClient.authenticate().sendMessage({ requestId: '1', authToken: 'admin' });
    console.log('res authenticate ', res);

    return true;
  } catch (err: any) {
    log.error(`${h.now()} we have error, ${err.message}`);
    return false;
  }
}
