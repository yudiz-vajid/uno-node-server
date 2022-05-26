/* eslint-disable no-unsafe-finally */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import type { Socket } from 'socket.io';
import { PlayerSocket } from './playerSocket';
import { verifyAuthHeader, verifySettings } from '../../validator';

class RootSocket {
  async initialize() {
    this.setEventListeners();
  }

  private setEventListeners() {
    global.io.use((socket: Socket, next: () => void) => this.authenticate(socket, next));
    global.io.on('connection', (socket: Socket) => new PlayerSocket(socket));
    global.io.on('error', (err: Error) => log.error(err));
  }

  // - executes once for each client during connection
  private async authenticate(socket: Socket, next: (error?: any) => void): Promise<boolean> {
    try {
      // prettier-ignore
      const { error: authError, info: authInfo, value: authValue } = await verifyAuthHeader({
        i_battle_id: socket.handshake.auth.i_battle_id ?? <any>socket.handshake.headers.i_battle_id,
        i_player_id: socket.handshake.auth.i_player_id ?? <any>socket.handshake.headers.i_player_id,
        s_auth_token: socket.handshake.auth.s_auth_token ?? <any>socket.handshake.headers.s_auth_token,
      });
      if (authError || !authValue) throw new Error(authInfo);

      const { error: settingsError, info: settingsInfo, value: settingsValue } = await verifySettings(socket.handshake.query);
      if (settingsError || !settingsValue) throw new Error(settingsInfo);

      const { iBattleId, iPlayerId, sAuthToken } = authValue;
      const { bMustCollectOnMissTurn, nUnoTime, nTurnMissLimit, nGraceTime, nTurnTime, nStartGameTime } = settingsValue;

      // TODO : validate playerId, battleId, authToken via grpc service
      const bIsValid = true;
      if (!bIsValid) throw new Error('player validation failed');

      socket.data.iPlayerId = iPlayerId;
      socket.data.iBattleId = iBattleId;
      socket.data.sAuthToken = sAuthToken;

      // TODO : fetch table settings from grpc service
      const aCardScore: any[] = []; // TODO : until grpc is sorted create dummy score
      socket.data.oSettings = { bMustCollectOnMissTurn, nUnoTime, nTurnMissLimit, nGraceTime, nTurnTime, nStartGameTime, aCardScore }; // TODO: remove when fetched via grpc
      next();
      return true;
    } catch (err: any) {
      next(err.message);
      log.silly(`authenticate failed : ${err.message}`);
      socket.disconnect();
      return false;
    }
  }
}

const rootSocket = new RootSocket();

export default rootSocket;
