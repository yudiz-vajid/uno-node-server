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

    // log.info('zookeeper initialize seq started ... ');
    // await init();
    // log.info('zookeeper initialize seq completed.');

    // log.info('gRPC initialize seq started ... ');
    // await grpc.init();
    // log.info('gRPC initialize seq completed. ');

    // log.info('fetching ZKConfig ...');
    // const ZKConfig = getConfig();
    // log.info('fetched ZKConfig.');
    // log.info(`ZKConfig = ${JSON.stringify(ZKConfig)}\n`);

    log.info('gRPC server start seq initiated...');
    await startGrpcServer();
    log.info('gRPC server start seq completed.');

    /* testing grpc services */
    // ! getting error  'getaddrinfo ENOTFOUND dev-consul.mpl.live, Error: getaddrinfo ENOTFOUND dev-consul.mpl.live'
    // const authClient = grpc.getGrpcClient().getAuthServiceClient();
    // if (!authClient) throw new Error('client is not available');
    // log.info(`authClient: ${JSON.stringify(authClient)}`);

    // const res = await authClient.authenticate().sendMessage({ requestId: '1', authToken: 'admin' });
    // log.info(`authClient.authenticate(): ${JSON.stringify(res)}`);

    const client = await PathFinder.getInstance().getClient({ serviceName: 'service-auth', serviceNameInProto: 'AuthService' });
    console.log('client', { client });
    const res = await client.authenticate().sendMessage({ requestId: '1', authToken: 'admin' });
    console.log('res', { res });

    return true;
  } catch (err: any) {
    log.error(`${h.now()} we have error, ${err.message}`);
    return false;
  }
}
