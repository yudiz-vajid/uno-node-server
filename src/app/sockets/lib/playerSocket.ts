/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import { Socket } from 'socket.io';

export class PlayerSocket {
  socket: Socket;

  IUserId: string;

  sAccessToken: string;

  constructor(socket: Socket) {
    this.socket = socket; // - socket = {id: <socketId>, ...other}
    this.IUserId = socket.data.IUserId;
    this.sAccessToken = socket.data.sAccessToken;

    this.socket.data = {}; // - clean up socket payload
    this.setEventListeners(); // - register listeners
    log.debug(`${_.now()} client: ${this.IUserId} connected with socketId : ${socket.id}`);
  }

  private setEventListeners() {
    this.socket.on('reqPing', this.reqPing.bind(this));
    this.socket.on('error', this.errorHandler.bind(this));
    this.socket.on('disconnect', this.disconnect.bind(this));

    // TODO : add event listeners
  }

  private reqPing(body: any, _ack?: () => unknown) {
    if (typeof _ack === 'function') _ack();
    log.debug(`${_.now()} client: '${this.IUserId}' => reqPing`);
  }

  private async disconnect(reason: string) {
    log.debug(`${_.now()} client: '${this.IUserId}' disconnected due to ${reason} having  socketId: '${this.socket.id}`);
    try {
      if (reason === 'server namespace disconnect') return;
      // TODO : handle reconnection
    } catch (err: any) {
      log.debug(`${_.now()} client: '${this.IUserId}' disconnect event failed. reason: ${err.message}`);
    }
  }

  private errorHandler(err: Error) {
    log.error(`${_.now()} socket error: ${err.message}`);
  }

  public toJSON() {
    return {
      socket: this.socket,
      IUserId: this.IUserId,
      sAccessToken: this.sAccessToken,
    };
  }
}
