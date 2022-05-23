/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { Socket } from 'socket.io';
import { PlayerSocket } from './playerSocket';

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
  private async authenticate(socket: Socket, next: (error?: any) => void) {
    try {
      // TODO : authenticate
      if (typeof next === 'function') next();
    } catch (err: any) {
      log.error(`Auth Middleware Error : ${err.message}`);
      socket.disconnect();
      if (typeof next === 'function') next(new Error('Unauthorized'));
    }
  }
}

const rootSocket = new RootSocket();

export default rootSocket;
