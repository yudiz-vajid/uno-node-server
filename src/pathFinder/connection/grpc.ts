// import { getConfig } from './zk';
// import PathFinder from 'lib-pathfinder-node';

// const grpcClientMap: any = {};

// const init = async (): Promise<boolean> => {
//   const ZKConfig = getConfig();

//   if (isZkConfigUse) {
//     grpcClientMap.getCardGamesClient = async function getCardGamesClient() {
//       return PathFinder.getInstance().getClient({
//         serviceName: ZKConfig.CARD_GAMES_SERVICE_PATH
//           ? ZKConfig.CARD_GAMES_SERVICE_PATH
//           : 'service-card-games',
//         serviceNameInProto: 'CardGamesService'
//       });
//     };

//     grpcClientMap.getAuthServiceClient = async function getAuthServiceClient() {
//       return PathFinder.getInstance().getClient({
//         serviceName: ZKConfig.AUTH_SERVICE_PATH
//           ? ZKConfig.AUTH_SERVICE_PATH
//           : 'service-auth',
//         serviceNameInProto: 'AuthService'
//       });
//     };

//     grpcClientMap.getUserServiceClient = async function getUserServiceClient() {
//       return PathFinder.getInstance().getClient({
//         serviceName: ZKConfig.USER_DATA_SERVICE_PATH
//           ? ZKConfig.USER_DATA_SERVICE_PATH
//           : 'service-user-data',
//         serviceNameInProto: 'UserDataService'
//       });
//     };
//   }
//   return false;
// };

// const getGrpcClient = () => grpcClientMap;

// const exportObject = {
//   init,
//   getGrpcClient
// };
// export = exportObject;
