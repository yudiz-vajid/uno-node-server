import { nanoid } from 'nanoid';
import { IAuthenticationResponse, IGetLobbyByIdResponse, ICreateTableResponse } from '../../types/global';

interface IUpdateBattleScoreRequest {
  requestId?: string;
  battleId: string; // from unity
  userId: string;
  score: number;
  scoreData: string; // stringified json of all round data of each user
}

async function authenticate(authToken: string, requestId: string = nanoid()): Promise<IAuthenticationResponse | null> {
  try {
    const authClient = await PF.getInstance().getClient({ serviceName: 'service-auth', serviceNameInProto: 'AuthService' });
    console.log('req authenticate');
    const res = await authClient.authenticate().sendMessage({ requestId, authToken });
    console.log('res authenticate ', _.stringify(res));
    return res;
  } catch (err: any) {
    log.error(`err authenticate ${err}`);
    return null;
  }
}

async function getLobbyById(lobbyId: number, userId: number, requestId: string = nanoid()): Promise<IGetLobbyByIdResponse | null> {
  try {
    const lobbyClient = await PF.getInstance().getClient({ serviceName: 'service-tournament-1v1', serviceNameInProto: 'LobbyService' });
    console.log('req authenticate');
    const res = await lobbyClient.getLobbyById().sendMessage({ requestId, id: lobbyId, userId });
    console.log('res getLobbyById ', _.stringify(res));
    return res;
  } catch (err: any) {
    log.error(`err getLobbyById ${err}`);
    return null;
  }
}

// to be called when last player joins
async function createBattle(lobbyId: number, battleId: string, userIds: Array<number>, requestId: string = nanoid()): Promise<ICreateTableResponse | null> {
  try {
    const lobbyClient = await PF.getInstance().getClient({ serviceName: 'service-tournament-1v1', serviceNameInProto: 'LobbyService' });
    console.log('req createBattle');
    const res = await lobbyClient.createBattle().sendMessage({ requestId, lobbyId, battleId, userIds }); // lobbyId battleId from unity
    console.log('res createBattle ', _.stringify(res));
    return res;
  } catch (err: any) {
    log.error(`err createBattle ${err}`);
    return null;
  }
}

async function finishBattleWithScores(gameId: string, score: Array<IUpdateBattleScoreRequest>, requestId: string = nanoid()) {
  try {
    const lobbyClient = await PF.getInstance().getClient({ serviceName: 'service-tournament-1v1', serviceNameInProto: 'LobbyService' });
    score.forEach((s: any) => {
      // eslint-disable-next-line no-param-reassign
      s.requestId = requestId;
    });
    // console.log('req finishBattleWithScores', score, gameId);
    const res = await lobbyClient.finishBattleWithScores().sendMessage({ requestId, gameId, score }); // lobbyId battleId from unity
    // console.log('res finishBattleWithScores ', _.stringify(res));
    return res;
  } catch (err: any) {
    log.error(`err finishBattleWithScores ${err}`);
    return null;
  }
}

const rpc = { authenticate, getLobbyById, createBattle, finishBattleWithScores };
export default rpc;
