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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const player_1 = __importDefault(require("./player"));
const table_1 = __importDefault(require("./table"));
class TableManager {
    constructor() {
        emitter.on('sch', this.onScheduledEvents.bind(this));
        emitter.on('redisEvent', this.onScheduledEvents.bind(this));
    }
    onScheduledEvents(body, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sTaskName, iBattleId, iPlayerId } = body, oData = __rest(body, ["sTaskName", "iBattleId", "iPlayerId"]);
            try {
                if (!sTaskName)
                    throw new Error('empty sTaskName');
                if (!iBattleId)
                    throw new Error('empty iBattleId');
                yield this.executeScheduledTask(sTaskName, iBattleId, iPlayerId !== null && iPlayerId !== void 0 ? iPlayerId : '', oData, callback);
            }
            catch (error) {
                log.debug(`Error Occurred on TableManager.onScheduledEvents(). sTaskName : ${sTaskName}. reason :${error.message}`);
            }
        });
    }
    executeScheduledTask(sTaskName, iBattleId, iPlayerId, oData, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`${_.now()} executeScheduledTask ${sTaskName}`);
            if (!sTaskName)
                return false;
            const oTable = yield TableManager.getTable(iBattleId);
            if (!oTable)
                return false;
            const participant = iPlayerId ? yield TableManager.getPlayer(iBattleId, iPlayerId) : undefined;
            switch (sTaskName) {
                case 'distributeCard':
                    yield oTable.distributeCard();
                    return true;
                case 'drawCard':
                    return true;
                case 'masterTimerExpired':
                    oTable.masterTimerExpired();
                    return true;
                case 'gameInitializeTimerExpired':
                    oTable.gameInitializeTimerExpired();
                    return true;
                case 'assignTurnTimerExpired':
                    participant.assignTurnTimerExpired();
                    return true;
                case 'assignGraceTimerExpired':
                    participant.assignGraceTimerExpired();
                    return true;
                default:
                    return false;
            }
        });
    }
    static createTable(oData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oTableWithParticipant = {
                    iBattleId: oData.iBattleId,
                    iPlayerTurn: '',
                    iSkippedPLayer: '',
                    aPlayerId: [],
                    aDrawPile: new util_1.Deck(oData.oSettings.aCardScore).getDeck(),
                    aDiscardPile: [],
                    bToSkip: false,
                    eState: 'waiting',
                    bTurnClockwise: true,
                    eNextCardColor: '',
                    nDrawCount: 0,
                    oSettings: oData.oSettings,
                    dCreatedAt: new Date(),
                };
                const sRedisSetResponse = yield redis.client.json.SET(_.getTableKey(oTableWithParticipant.iBattleId), '.', oTableWithParticipant);
                if (!sRedisSetResponse)
                    return null;
                return new table_1.default(oTableWithParticipant);
            }
            catch (err) {
                log.error(`Error Occurred on TableManager,createTable(). reason :${err.message}`);
                log.silly(oData);
                return null;
            }
        });
    }
    static createPlayer(oPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sRedisSetResponse = yield redis.client.json.SET(_.getPlayerKey(oPlayer.iBattleId, oPlayer.iPlayerId), '.', oPlayer);
                if (!sRedisSetResponse)
                    return null;
                const oTable = yield TableManager.getTable(oPlayer.iBattleId);
                return new player_1.default(oTable, oPlayer);
            }
            catch (err) {
                log.error(`Error Occurred on TableManager.createPlayer(). reason :${err.message}`);
                log.silly(oPlayer);
                return null;
            }
        });
    }
    static getTable(iBattleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oTableData = (yield redis.client.json.GET(_.getTableKey(iBattleId)));
                if (!oTableData)
                    return null;
                const aPromise = [];
                oTableData.aPlayerId.forEach(iPlayerId => aPromise.push(redis.client.json.GET(_.getPlayerKey(iBattleId, iPlayerId))));
                const aPlayer = (yield Promise.all(aPromise));
                if (aPlayer.some(p => !p))
                    log.error('error');
                const aPlayerClassified = aPlayer.map(p => (p ? new player_1.default(oTableData, p) : null));
                return new table_1.default(Object.assign(Object.assign({}, oTableData), { aPlayer: aPlayerClassified.filter(p => p) }));
            }
            catch (err) {
                log.error(`Error Occurred on TableManager.getTable(). reason :${err.message}`);
                log.silly(`iBattleId : ${iBattleId}`);
                return null;
            }
        });
    }
    static getPlayer(iBattleId, iPlayerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oPlayerData = (yield redis.client.json.GET(_.getPlayerKey(iBattleId, iPlayerId)));
                if (!oPlayerData)
                    return null;
                const oTable = yield TableManager.getTable(iBattleId);
                return new player_1.default(oTable, oPlayerData);
            }
            catch (err) {
                log.error(`Error Occurred on TableManager.getPlayer(). reason :${err.message}`);
                log.silly(`iBattleId : ${iBattleId} iPlayerId : ${iPlayerId}`);
                return null;
            }
        });
    }
    static getTablePlayers(iBattleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oTableData = (yield redis.client.json.GET(_.getTableKey(iBattleId)));
            if (!oTableData)
                return null;
            let aPlayerData = [];
            for (let iPlayerId of oTableData.aPlayerId) {
                aPlayerData.push(yield redis.client.json.GET(_.getPlayerKey(iBattleId, iPlayerId)));
            }
            return aPlayerData;
        });
    }
}
exports.default = TableManager;
