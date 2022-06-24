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
const util_1 = require("../util");
const player_1 = __importDefault(require("./player"));
const table_1 = __importDefault(require("./table"));
class TableManager {
    constructor() {
        emitter.on('sch', this.onScheduledEvents.bind(this));
        emitter.on('redisEvent', this.onScheduledEvents.bind(this));
        emitter.on('channelEvent', this.onScheduledEvents.bind(this));
    }
    onScheduledEvents(body, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sTaskName, iBattleId, iPlayerId, oData } = body;
            try {
                if (!sTaskName)
                    throw new Error('empty sTaskName');
                if (!iBattleId)
                    throw new Error('empty iBattleId');
                yield this.executeScheduledTask(sTaskName, iBattleId, iPlayerId !== null && iPlayerId !== void 0 ? iPlayerId : '', oData, callback);
            }
            catch (error) {
                log.debug(`${_.now()} Error Occurred on TableManager.onScheduledEvents(). sTaskName : ${sTaskName}. reason :${error.message}`);
            }
        });
    }
    executeScheduledTask(sTaskName, iBattleId, iPlayerId, oData, callback) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!sTaskName)
                return false;
            const oTable = yield TableManager.getTable(iBattleId);
            if (!oTable)
                return false;
            const oPlayer = oTable.getPlayer(iPlayerId);
            if (['assignTurnTimerExpired', 'assignGraceTimerExpired', 'drawCard', 'discardCard'].includes(sTaskName)) {
                if (!oPlayer) {
                    callback({ oData: {}, status: util_1.response.PLAYER_NOT_FOUND });
                    return (_a = (log.warn(`${_.now()} oPlayer not found in table. { iBattleId : ${iBattleId}, iPlayerId : ${iPlayerId} }`) && null)) !== null && _a !== void 0 ? _a : false;
                }
                if (oTable.toJSON().eState !== 'running' && ['drawCard', 'discardCard'].includes(sTaskName)) {
                    callback({ oData: {}, status: util_1.response.TABLE_NOT_RUNNING });
                    return (_b = (log.warn(`${_.now()} Table is not in running state. { iBattleId : ${iBattleId}, eState : ${oTable.toJSON().eState} }`) && null)) !== null && _b !== void 0 ? _b : false;
                }
                if (!oTable.hasValidTurn(iPlayerId) && ['drawCard', 'discardCard'].includes(sTaskName)) {
                    callback({ oData: {}, status: util_1.response.NOT_YOUR_TURN });
                    return (_c = (log.silly(`${_.now()} ${iPlayerId} has not valid turn.`) && null)) !== null && _c !== void 0 ? _c : false;
                }
            }
            switch (sTaskName) {
                case 'distributeCard':
                    yield oTable.distributeCard();
                    return true;
                case 'masterTimerExpired':
                    oTable.masterTimerExpired();
                    return true;
                case 'gameInitializeTimerExpired':
                    oTable.gameInitializeTimerExpired();
                    return true;
                case 'assignTurnTimerExpired':
                    oPlayer === null || oPlayer === void 0 ? void 0 : oPlayer.assignTurnTimerExpired(oTable);
                    return true;
                case 'assignGraceTimerExpired':
                    oPlayer === null || oPlayer === void 0 ? void 0 : oPlayer.assignGraceTimerExpired(oTable);
                    return true;
                case 'assignWildCardColorTimerExpired':
                    oPlayer === null || oPlayer === void 0 ? void 0 : oPlayer.assignWildCardColorTimerExpired(oTable);
                    return true;
                case 'drawCard':
                    oPlayer === null || oPlayer === void 0 ? void 0 : oPlayer.drawCard({}, oTable, callback);
                    return true;
                case 'keepCard':
                    oPlayer === null || oPlayer === void 0 ? void 0 : oPlayer.keepCard({}, oTable, callback);
                    return true;
                case 'setWildCardColor':
                    oPlayer === null || oPlayer === void 0 ? void 0 : oPlayer.setWildCardColor({}, oTable, callback);
                    return true;
                case 'discardCard':
                    oPlayer === null || oPlayer === void 0 ? void 0 : oPlayer.discardCard(oData, oTable, callback);
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
                log.error(`${_.now()} Error Occurred on TableManager,createTable(). reason :${err.message}`);
                log.silly(`${_.now()} oData: ${oData}`);
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
                return new player_1.default(oPlayer);
            }
            catch (err) {
                log.error(`${_.now()} Error Occurred on TableManager.createPlayer(). reason :${err.message}`);
                log.silly(`${_.now()} oPlayer: ${oPlayer}`);
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
                const aPlayerClassified = aPlayer.map(p => (p ? new player_1.default(p) : null));
                return new table_1.default(Object.assign(Object.assign({}, oTableData), { aPlayer: aPlayerClassified.filter(p => p) }));
            }
            catch (err) {
                log.error(`${_.now()} Error Occurred on TableManager.getTable(). reason :${err.message}`);
                log.silly(`${_.now()} iBattleId : ${iBattleId}`);
                return null;
            }
        });
    }
}
exports.default = TableManager;
