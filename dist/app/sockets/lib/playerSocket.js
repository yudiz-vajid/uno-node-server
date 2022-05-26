"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerSocket = void 0;
class PlayerSocket {
    constructor(socket) {
        this.socket = socket;
        this.iPlayerId = socket.data.iPlayerId;
        this.iBattleId = socket.data.iBattleId;
        this.sAuthToken = socket.data.sAuthToken;
        this.oSetting = socket.data.oSettings;
        this.socket.data = {};
        this.setEventListeners();
        log.debug(`${_.now()} client: ${this.iPlayerId} connected with socketId : ${this.socket.id}`);
    }
    setEventListeners() {
        this.socket.on('reqPing', this.reqPing.bind(this));
        this.socket.on('error', this.errorHandler.bind(this));
        this.socket.on('disconnect', this.disconnect.bind(this));
        this.socket.on('joinTable', () => { });
    }
    reqPing(body, _ack) {
        if (typeof _ack === 'function')
            _ack('pong');
        log.verbose(`${_.now()} client: '${this.iPlayerId}' => ping`);
    }
    disconnect(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            log.debug(`${_.now()} client: ${this.iPlayerId} disconnected with socketId : ${this.socket.id}. reason: ${reason}`);
            try {
                if (reason === 'server namespace disconnect')
                    return;
            }
            catch (err) {
                log.debug(`${_.now()} client: '${this.iPlayerId}' disconnect event failed. reason: ${err.message}`);
            }
        });
    }
    errorHandler(err) {
        log.error(`${_.now()} socket error: ${err.message}`);
    }
    toJSON() {
        return {
            socket: this.socket,
            iPlayerId: this.iPlayerId,
            iBattleId: this.iBattleId,
            sAuthToken: this.sAuthToken,
            oSetting: this.oSetting,
        };
    }
}
exports.PlayerSocket = PlayerSocket;
