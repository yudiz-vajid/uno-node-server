/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import type { Socket } from 'socket.io';
import PlayerSocket from './playerSocket';
import { verifyAuthHeader, verifySettings } from '../../validator';
import { ICallback } from '../../../types/global';

class RootSocket {
  async initialize() {
    this.setEventListeners();
  }

  private setEventListeners() {
    global.io.use((socket: Socket, next: () => void) => this.authenticate(socket, next));
    global.io.on('connection', (socket: Socket) => new PlayerSocket(socket));
    global.io.on('error', (err: Error) => log.error(err));
  }

  private async authenticate(socket: Socket, next: ICallback): Promise<boolean> {
    // - executes once for each client during connection
    try {
      // prettier-ignore
      const { error: authError, info: authInfo, value: authValue } = await verifyAuthHeader({
        i_battle_id: socket.handshake.auth.i_battle_id ?? <unknown>socket.handshake.headers.i_battle_id,
        i_player_id: socket.handshake.auth.i_player_id ?? <unknown>socket.handshake.headers.i_player_id,
        s_auth_token: socket.handshake.auth.s_auth_token ?? <unknown>socket.handshake.headers.s_auth_token,
      });
      if (authError || !authValue) throw new Error(authInfo);

      const { error: settingsError, info: settingsInfo, value: settingsValue } = await verifySettings(socket.handshake.query);
      if (settingsError || !settingsValue) throw new Error(settingsInfo);

      const { iBattleId, iPlayerId, sPlayerName, sAuthToken } = authValue;

      const bIsValid = true; // TODO : validate playerId, battleId, authToken via grpc service
      if (!bIsValid) throw new Error('player validation failed');

      socket.data.iPlayerId = iPlayerId;
      socket.data.iBattleId = iBattleId;
      socket.data.sPlayerName = sPlayerName;
      socket.data.sAuthToken = sAuthToken;
      socket.data.oSettings = settingsValue; // TODO: remove to be fetch from grpc service
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
