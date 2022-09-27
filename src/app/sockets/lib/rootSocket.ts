/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-param-reassign */
import type { Socket } from 'socket.io';
import PlayerSocket from './playerSocket';
import { verifyAuthHeader, verifySettings } from '../../validator';
import { ICallback } from '../../../types/global';
// eslint-disable-next-line no-unused-vars
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
      log.debug('1. connection request recieved');
      // prettier-ignore
      const { error: authError, info: authInfo, value: authValue } = await verifyAuthHeader({
        isNewMatchMakingFlowEnabled: socket.handshake.auth.isNewMatchMakingFlowEnabled ?? <unknown>socket.handshake.headers.isNewMatchMakingFlowEnabled,
        i_battle_id: socket.handshake.auth.i_battle_id ?? <unknown>socket.handshake.headers.i_battle_id,
        i_lobby_id: socket.handshake.auth.i_lobby_id ?? <unknown>socket.handshake.headers.i_lobby_id,
        i_player_id: socket.handshake.auth.i_player_id ?? <unknown>socket.handshake.headers.i_player_id,
        s_auth_token: socket.handshake.auth.s_auth_token ?? <unknown>socket.handshake.headers.s_auth_token,
        isReconnect: socket.handshake.auth.isReconnect ?? <unknown>socket.handshake.headers.isReconnect,
        nTablePlayer: socket.handshake.auth.nTablePlayer ?? <unknown>socket.handshake.headers.nTablePlayer,
        nMinTablePlayer: socket.handshake.auth.nMinTablePlayer ?? <unknown>socket.handshake.headers.nMinTablePlayer,
      });
      if (authError || !authValue) throw new Error(authInfo);

      log.debug('2. verifying payload');
      const { error: settingsError, info: settingsInfo, value: settingsValue } = await verifySettings(socket.handshake.query);
      if (settingsError || !settingsValue) throw new Error(settingsInfo);
      log.debug('3. payload verified');

      const { isNewMatchMakingFlowEnabled, iBattleId, iPlayerId, sPlayerName, sAuthToken, iLobbyId, isReconnect, nTablePlayer, nMinTablePlayer } = authValue;

      socket.data.isNewMatchMakingFlowEnabled = isNewMatchMakingFlowEnabled;
      socket.data.isReconnect = isReconnect;
      socket.data.iLobbyId = iLobbyId;
      socket.data.iPlayerId = iPlayerId;
      socket.data.sPlayerName = sPlayerName;
      socket.data.sAuthToken = sAuthToken;
      socket.data.oSettings = settingsValue;
      socket.data.nMinTablePlayer = nMinTablePlayer;
      // socket.data.iBattleId = iBattleId;
      // socket.data.nTablePlayer = nTablePlayer;

      if (isNewMatchMakingFlowEnabled) {
        socket.data.iBattleId = iBattleId;
        socket.data.nTablePlayer = nTablePlayer;
      }
      let bIsValid = false;
      log.debug('4.1. Authenticating player');
      if (process.env.NODE_ENV !== 'dev') {
        log.verbose(`sAuthToken --> ${sAuthToken}`);
        const authResult = await rpc.authenticate(sAuthToken);
        log.verbose(`4.2. gRPC auth res:: ${_.stringify(authResult)}`);
        if (!authResult || authResult.error || !authResult.isAuthentic) bIsValid = false;
        else bIsValid = true;
      } else bIsValid = true;
      if (!bIsValid) throw new Error('player validation failed');
      log.debug('5. player authenticated'); //
      next();
      return true;
    } catch (err: any) {
      next(err.message);
      log.debug(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nauthenticate failed : ${err.message}`);
      socket.disconnect();
      return false;
    }
  }
}

const rootSocket = new RootSocket();

export default rootSocket;
