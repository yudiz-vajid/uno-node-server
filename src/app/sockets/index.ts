/* eslint-disable no-new */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */

import { Server as HttpServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import rootSocket from './lib/rootSocket';
import SocketManager from '../socketManager';

class SocketIO {
  private options: Partial<ServerOptions> | undefined;

  constructor() {
    this.options = {
      pingInterval: 400000, // - default 25000
      pingTimeout: 400000, // - default 20000
      maxHttpBufferSize: 1e8, // - default 1e8 -> 1 MB
      allowUpgrades: true,
      perMessageDeflate: false,
      serveClient: true,
      cookie: false,
      transports: ['websocket'],
      path: '/socket.io/',
      connectTimeout: 45000, // - ms to wait before rejecting handshake
      allowEIO3: false,
      parser: require('socket.io-parser'),
      cors: {
        origin: '*:*',
        methods: ['GET', 'POST'],
        credentials: false,
      },
    };
  }

  async initialize(httpServer: HttpServer) {
    const io = new Server(httpServer, this.options);
    io.adapter(redis.getAdapter());
    global.io = io;
    await rootSocket.initialize();
    new SocketManager();
    log.info('Socket.io initialized 🔌');
  }
}
const socket = new SocketIO();
export default socket;