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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = __importDefault(require("./channel"));
const util_1 = require("../../util");
const tableManager_1 = __importDefault(require("../../tableManager"));
class PlayerSocket {
    constructor(socket) {
        this.socket = socket;
        this.iPlayerId = socket.data.iPlayerId;
        this.iBattleId = socket.data.iBattleId;
        this.sPlayerName = socket.data.sPlayerName;
        this.sAuthToken = socket.data.sAuthToken;
        this.oSetting = socket.data.oSettings;
        this.socket.data = {};
        this.setEventListeners();
        log.debug(`${_.now()} client: ${this.iPlayerId} connected with socketId : ${this.socket.id}`);
    }
    setEventListeners() {
        this.socket.on('reqPing', this.reqPing.bind(this));
        this.socket.on('reqTableJoin', this.joinTable.bind(this));
        this.socket.on('error', this.errorHandler.bind(this));
        this.socket.on('disconnect', this.disconnect.bind(this));
    }
    joinTable(body, _ack) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof _ack !== 'function')
                return false;
            try {
                let oTable = yield tableManager_1.default.getTable(this.iBattleId);
                if (!oTable)
                    oTable = yield tableManager_1.default.createTable({ iBattleId: this.iBattleId, oSettings: this.oSetting });
                if (!oTable)
                    throw new Error('Table not created');
                let oPlayer = oTable.getPlayer(this.iPlayerId);
                if (!oPlayer) {
                    oPlayer = yield tableManager_1.default.createPlayer({
                        iPlayerId: this.iPlayerId,
                        iBattleId: this.iBattleId,
                        sPlayerName: this.sPlayerName,
                        sSocketId: this.socket.id,
                        nSeat: oTable.toJSON().aPlayer.length,
                        nScore: 0,
                        nUnoTime: oTable.toJSON().oSettings.nUnoTime,
                        nGraceTime: oTable.toJSON().oSettings.nGraceTime,
                        nMissedTurn: 0,
                        nDrawNormal: 0,
                        nReconnectionAttempt: 0,
                        bSpecialMeterFull: false,
                        aHand: [],
                        eState: 'waiting',
                        dCreatedAt: new Date(),
                    });
                    if (!oPlayer)
                        throw new Error('Player not created');
                    _ack({ iBattleId: this.iBattleId, iPlayerId: this.iPlayerId, status: util_1.response.SUCCESS });
                    if (!(yield oTable.addPlayer(oPlayer)))
                        throw new Error('Player not added to table');
                }
                else {
                    _ack({ iBattleId: this.iBattleId, iPlayerId: this.iPlayerId, status: util_1.response.SUCCESS });
                    yield oPlayer.reconnect(this.socket.id, oTable.toJSON().eState);
                }
                if (!this.socket.eventNames().includes(this.iBattleId)) {
                    const channel = new channel_1.default(this.iBattleId, this.iPlayerId);
                    this.socket.on(this.iBattleId, channel.onEvent.bind(channel));
                }
                return true;
            }
            catch (err) {
                log.error(`${_.now()} client: '${this.iPlayerId}' joinTable event failed. reason: ${err.message}`);
                _ack({ iBattleId: this.iBattleId, iPlayerId: this.iPlayerId, status: util_1.response.SERVER_ERROR });
                return false;
            }
        });
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
                const table = yield tableManager_1.default.getTable(this.iBattleId);
                const player = yield (table === null || table === void 0 ? void 0 : table.getPlayer(this.iPlayerId));
                if (!player)
                    return;
                yield player.update({ eState: 'disconnected' });
                table === null || table === void 0 ? void 0 : table.emit('playerDisconnected', { iPlayerId: this.iPlayerId });
            }
            catch (err) {
                log.debug(`${_.now()} client: '${this.iPlayerId}' disconnect event failed. reason: ${err.message}`);
            }
        });
    }
    errorHandler(err) {
        log.error(`${_.now()} socket error. iPlayerId: ${this.iPlayerId}, iBattleId: ${this.iBattleId}. reason: ${err.message}`);
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
exports.default = PlayerSocket;
