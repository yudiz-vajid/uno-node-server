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
const playerSocket_1 = __importDefault(require("./playerSocket"));
const validator_1 = require("../../validator");
const rpc_1 = __importDefault(require("../../../pathFinder/service/rpc"));
class RootSocket {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setEventListeners();
        });
    }
    setEventListeners() {
        global.io.use((socket, next) => this.authenticate(socket, next));
        global.io.on('connection', (socket) => new playerSocket_1.default(socket));
        global.io.on('error', (err) => log.error(err));
    }
    authenticate(socket, next) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error: authError, info: authInfo, value: authValue } = yield (0, validator_1.verifyAuthHeader)({
                    i_battle_id: (_a = socket.handshake.auth.i_battle_id) !== null && _a !== void 0 ? _a : socket.handshake.headers.i_battle_id,
                    i_lobby_id: (_b = socket.handshake.auth.i_lobby_id) !== null && _b !== void 0 ? _b : socket.handshake.headers.i_lobby_id,
                    i_player_id: (_c = socket.handshake.auth.i_player_id) !== null && _c !== void 0 ? _c : socket.handshake.headers.i_player_id,
                    s_auth_token: (_d = socket.handshake.auth.s_auth_token) !== null && _d !== void 0 ? _d : socket.handshake.headers.s_auth_token,
                });
                if (authError || !authValue)
                    throw new Error(authInfo);
                const { error: settingsError, info: settingsInfo, value: settingsValue } = yield (0, validator_1.verifySettings)(socket.handshake.query);
                if (settingsError || !settingsValue)
                    throw new Error(settingsInfo);
                const { iBattleId, iPlayerId, sPlayerName, sAuthToken, iLobbyId } = authValue;
                socket.data.iBattleId = iBattleId;
                socket.data.iLobbyId = iLobbyId;
                socket.data.iPlayerId = iPlayerId;
                socket.data.sPlayerName = sPlayerName;
                socket.data.sAuthToken = sAuthToken;
                socket.data.oSettings = settingsValue;
                let bIsValid = false;
                if (process.env.NODE_ENV !== 'dev') {
                    const authResult = yield rpc_1.default.authenticate(sAuthToken);
                    if (!authResult || authResult.error || !authResult.isAuthentic)
                        bIsValid = true;
                    socket.data.iPlayerId = authResult === null || authResult === void 0 ? void 0 : authResult.userId;
                }
                else
                    bIsValid = true;
                if (!bIsValid)
                    throw new Error('player validation failed');
                next();
                return true;
            }
            catch (err) {
                next(err.message);
                log.silly(`authenticate failed : ${err.message}`);
                socket.disconnect();
                return false;
            }
        });
    }
}
const rootSocket = new RootSocket();
exports.default = rootSocket;
