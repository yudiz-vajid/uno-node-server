import { nanoid } from 'nanoid';

interface IUpdateBattleScoreRequest {
  requestId?: string;
  battleId: string; // from unity
  userId: string;
  score: number;
  scoreData: string; // stringified json of all round data of each user
}

export async function authenticate(authToken: string, requestId: string = nanoid()) {
  const authClient = await PF.getInstance().getClient({ serviceName: 'service-auth', serviceNameInProto: 'AuthService' });
  console.log('req authenticate');
  const resAuth = await authClient.authenticate().sendMessage({ requestId: requestId, authToken: authToken });
  console.log('res authenticate ', resAuth);
  return resAuth;
}

export async function getLobbyById(lobbyId: number, userId: number, requestId: string = nanoid()) {
  const lobbyClient = await PF.getInstance().getClient({ serviceName: 'service-tournament-1v1', serviceNameInProto: 'LobbyService' });
  console.log('req authenticate');
  const res = await lobbyClient.getLobbyById().sendMessage({ requestId: requestId, id: lobbyId, userId: userId });
  console.log('res getLobbyById ', res);
  return res;
}

// to be called when last player joins
export async function createBattle(lobbyId: number, battleId: string, userIds: Array<number>, requestId: string = nanoid()) {
  const lobbyClient = await PF.getInstance().getClient({ serviceName: 'service-tournament-1v1', serviceNameInProto: 'LobbyService' });
  console.log('req createBattle');
  const res = await lobbyClient.createBattle().sendMessage({ requestId: requestId, lobbyId: lobbyId, battleId: battleId, userIds: userIds }); // lobbyId battleId from unity
  console.log('res createBattle ', res);
  return res;
}

export async function finishBattleWithScores(gameId: string, score: Array<IUpdateBattleScoreRequest>, requestId: string = nanoid()) {
  const lobbyClient = await PF.getInstance().getClient({ serviceName: 'service-tournament-1v1', serviceNameInProto: 'LobbyService' });
  console.log('req finishBattleWithScores');
  const res = await lobbyClient.finishBattleWithScores().sendMessage({ requestId: requestId, gameId: gameId, score: score }); // lobbyId battleId from unity
  console.log('res finishBattleWithScores ', res);
  return res;
}
