const HTTP_SERVER_PORT = 3000;
const SERVER_TYPE = process.argv[3] ? process.argv[3].toUpperCase() : 'SOCKET'; // API/SOCKET
const SERVER_ENV = process.argv[4] || 'dev';
// eslint-disable-next-line radix
const GRPC_SERVER_PORT: number = parseInt(process.argv[5]) || 50100;

const CONFIG_CLUSTER = '';
const isZkConfigUse = SERVER_ENV === 'dev';
const currentIndexForServicesOfGRPC: any = {};

const exportObject = {
  HTTP_SERVER_PORT,
  SERVER_TYPE,
  SERVER_ENV,
  CONFIG_CLUSTER,
  isZkConfigUse,
  currentIndexForServicesOfGRPC,
  GRPC_SERVER_PORT,
};

export = exportObject;
