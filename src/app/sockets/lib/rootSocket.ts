/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-param-reassign */
import type { Socket } from 'socket.io';
import PlayerSocket from './playerSocket';
import { verifyAuthHeader, verifySettings } from '../../validator';
import { ICallback } from '../../../types/global';
import rpc from '../../../pathFinder/service/rpc';

class RootSocket {
  async initialize() {
    this.setEventListeners();
  }

  private setEventListeners() {
    global.io.use((socket: Socket, next: () => void) => this.authenticate(socket, next));
    global.io.on('connection', (socket: Socket) => new PlayerSocket(socket));
    global.io.on('error', (err: Error) => log.error(err));
  }

  // eslint-disable-next-line class-methods-use-this
  private async authenticate(socket: Socket, next: ICallback): Promise<boolean> {
    // - executes once for each client during connection
    try {
      // prettier-ignore
      const { error: authError, info: authInfo, value: authValue } = await verifyAuthHeader({
        i_battle_id: socket.handshake.auth.i_battle_id ?? <unknown>socket.handshake.headers.i_battle_id,
        i_lobby_id: socket.handshake.auth.i_lobby_id ?? <unknown>socket.handshake.headers.i_lobby_id,
        i_player_id: socket.handshake.auth.i_player_id ?? <unknown>socket.handshake.headers.i_player_id,
        s_auth_token: socket.handshake.auth.s_auth_token ?? <unknown>socket.handshake.headers.s_auth_token,
      });
      if (authError || !authValue) throw new Error(authInfo);

      const { error: settingsError, info: settingsInfo, value: settingsValue } = await verifySettings(socket.handshake.query);
      if (settingsError || !settingsValue) throw new Error(settingsInfo);

      const { iBattleId, iPlayerId, sPlayerName, sAuthToken, iLobbyId } = authValue;

      socket.data.iBattleId = iBattleId;
      socket.data.iLobbyId = iLobbyId;
      socket.data.iPlayerId = iPlayerId;
      socket.data.sPlayerName = sPlayerName;
      socket.data.sAuthToken = sAuthToken;
      socket.data.oSettings = settingsValue;
      let bIsValid = false;
      if (process.env.NODE_ENV !== 'dev') {
        const authResult = await rpc.authenticate(sAuthToken);
        log.verbose(`gRPC auth res:: ${authResult}`);
        if (!authResult || authResult.error || !authResult.isAuthentic) bIsValid = true;
        socket.data.iPlayerId = authResult?.userId;
      } else bIsValid = true;
      if (!bIsValid) throw new Error('player validation failed');
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
