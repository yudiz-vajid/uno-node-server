import SOCKET from './socket';
import ZOOKEEPER from './zookeeper';
import GRPC from './grpc';

const exportObject = Object.freeze({
  SOCKET,
  ZOOKEEPER,
  GRPC
});
export = exportObject;
