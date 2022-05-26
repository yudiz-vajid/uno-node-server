/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import type { Socket } from 'socket.io';
import { ISettings } from 'global';

export class PlayerSocket {
  private socket: Socket;

  private iPlayerId: string;

  private iBattleId: string;

  private sAuthToken: string;

  private oSetting: ISettings;

  constructor(socket: Socket) {
    this.socket = socket; // - socket = {id: <socketId>, ...other}
    this.iPlayerId = socket.data.iPlayerId;
    this.iBattleId = socket.data.iBattleId;
    this.sAuthToken = socket.data.sAuthToken;
    this.oSetting = socket.data.oSettings;

    this.socket.data = {}; // - clean up socket payload
    this.setEventListeners(); // - register listeners
    log.debug(`${_.now()} client: ${this.iPlayerId} connected with socketId : ${this.socket.id}`);
  }

  private setEventListeners() {
    this.socket.on('reqPing', this.reqPing.bind(this));
    this.socket.on('error', this.errorHandler.bind(this));
    this.socket.on('disconnect', this.disconnect.bind(this));

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.socket.on('joinTable', () => {});
  }

  private reqPing(body: any, _ack?: () => unknown) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof _ack === 'function') _ack('pong');
    log.verbose(`${_.now()} client: '${this.iPlayerId}' => ping`);
  }

  private async disconnect(reason: string) {
    log.debug(`${_.now()} client: ${this.iPlayerId} disconnected with socketId : ${this.socket.id}. reason: ${reason}`);
    try {
      if (reason === 'server namespace disconnect') return;
      // TODO : handle reconnection
    } catch (err: any) {
      log.debug(`${_.now()} client: '${this.iPlayerId}' disconnect event failed. reason: ${err.message}`);
    }
  }

  private errorHandler(err: Error) {
    log.error(`${_.now()} socket error: ${err.message}`);
  }

  public toJSON() {
    return {
      socket: this.socket,
      iPlayerId: this.iPlayerId,
      iBattleId: this.iBattleId,
      sAuthToken: this.sAuthToken,
      oSetting: this.oSetting,
    };
  }
}
