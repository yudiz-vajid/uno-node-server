import path from 'path';
import PathFinder, { PFServer } from 'lib-pathfinder-node';
import protos from './protos';
import { init, getConfig, getHostWithPort, getHostWithPortOnly } from './connection/zk';
import grpc from './connection/grpc';

const loadOpts = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

async function createClient(serviceName: string, serviceNameInProto: string) {
  try {
    /* For Consul Service Discovery - IP Only */
    log.info('Consul Service Discovery deq Initiated ...');
    const url = await PathFinder.getInstance().getServerUrl('AuthService');
    log.info('Consul Service Discovery deq Initiated ...');

    const client = await PathFinder.getInstance().getClient({
      serviceName,
      serviceNameInProto,
      tag: 'IN',
    });
    log.info('Initiated Client');
    return client;
  } catch (err: any) {
    log.error(`${h.now()} we have error, ${err.message}, ${err.stack}`);
  }
}

async function addServiceAndStartGrpcServer() {
  try {
    const server = new PFServer('service-uno', 50100);
    server.addService(
      path.join(__dirname, '/protos/lib/AuthService.proto'),
      path.join(__dirname, 'protosMethod/index.js')
      //
    );
    await server.start();
    log.info('GRPC server started');
  } catch (err: any) {
    log.error(`${h.now()} we have error, ${err.message}, ${err.stack}`);
  }
}

export async function initializePathFinder() {
  try {
    PathFinder.initialize({ appName: 'service-callbreak', protosToLoad: protos, loadOpts, promisify: true });
    log.info('PathFinder initialize seq started ... ');

    const _zk = await init();
    log.info('PathFinder initialize seq completed.', _zk);

    log.info('gRPC initialize seq started ... ');
    await grpc.init();
    log.info('gRPC initialize seq completed. ');

    log.info('fetching ZKConfig ...');
    const ZKConfig = getConfig();
    log.info('fetched ZKConfig.');
    log.info(`ZKConfig = ${JSON.stringify(ZKConfig)}\n`);

    await addServiceAndStartGrpcServer();
    // const client = await createClient('service-auth', 'AuthService');
    // if (!client) throw new Error('client is not available');
    // log.info(`client: ${client}`);

    /* testing grpc services */

    // const authClient = getGrpcClient().getAuthServiceClient();
    // if (!authClient) throw new Error('client is not available');
    // log.info(`client: ${JSON.stringify(client)}`);

    return true;
  } catch (err: any) {
    log.error(`${h.now()} we have error, ${err.message}`);
    return false;
  }
}
