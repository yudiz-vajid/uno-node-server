import path from 'path';
import PathFinder, { PFServer } from 'lib-pathfinder-node';
import protos from './protos';

const loadOpts = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

async function createClient(serviceName: string, serviceNameInProto: string) {
  try {
    // For Consul Service Discovery - IP Only
    const url = await PathFinder.getInstance().getServerUrl('AuthService');
    const client = await PathFinder.getInstance().getClient({
      serviceName,
      serviceNameInProto,
      tag: 'IN'
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
    PathFinder.initialize({ appName: 'service-uno', protosToLoad: protos, loadOpts, promisify: true });
    log.info('PathFinder initialized');
    await addServiceAndStartGrpcServer();
    const client = await createClient('service-auth', 'AuthService');
    if(!client) throw new Error('client is not available');
    log.info(`client: ${client}`);
    return true;
  } catch (err: any) {
    log.error(`${h.now()} we have error, ${err.message}`);
    return false;
  }
}
