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
class Service {
    constructor(oData) {
        this.iPlayerId = oData.iPlayerId;
        this.iBattleId = oData.iBattleId;
        this.sPlayerName = oData.sPlayerName;
        this.sSocketId = oData.sSocketId;
        this.nSeat = oData.nSeat;
        this.nScore = oData.nScore;
        this.nUnoTime = oData.nUnoTime;
        this.nGraceTime = oData.nGraceTime;
        this.nMissedTurn = oData.nMissedTurn;
        this.nDrawNormal = oData.nDrawNormal;
        this.nReconnectionAttempt = oData.nReconnectionAttempt;
        this.bSpecialMeterFull = oData.bSpecialMeterFull;
        this.aHand = oData.aHand;
        this.eState = oData.eState;
        this.dCreatedAt = oData.dCreatedAt;
    }
    update(oDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aPromise = [];
                const sPlayerKey = _.getPlayerKey(this.iBattleId, this.iPlayerId);
                Object.entries(oDate).forEach(([k, v]) => {
                    switch (k) {
                        case 'sSocketId':
                            this.sSocketId = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nScore':
                            this.nScore = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nUnoTime':
                            this.nUnoTime = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nGraceTime':
                            this.nGraceTime = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nMissedTurn':
                            this.nMissedTurn = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nDrawNormal':
                            this.nDrawNormal = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nReconnectionAttempt':
                            this.nReconnectionAttempt = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'bSpecialMeterFull':
                            this.bSpecialMeterFull = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'aHand':
                            this.aHand = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'eState':
                            this.eState = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        default:
                            break;
                    }
                });
                const aRedisSetResponse = (yield Promise.all(aPromise));
                if (aRedisSetResponse.some(ok => !ok))
                    log.error('Player.update() failed. reason: redis.client.json.SET failed for some key');
                return this.toJSON();
            }
            catch (err) {
                log.error(`Error Occurred on Player.update(). reason :${err.message}`);
                log.silly(this.toJSON());
                return null;
            }
        });
    }
    setHand(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!oTable)
                return false;
            const { aDrawPile, oSettings } = oTable.toJSON();
            const aNormalCards = aDrawPile.filter(card => card.nLabel < 10 && card.eColor !== 'black');
            const aSpecialCards = aDrawPile.filter(card => card.nLabel > 9 && card.nLabel < 13);
            const aActionCards = aDrawPile.filter(card => card.nLabel > 12);
            if (!aNormalCards || !aSpecialCards || !aActionCards)
                return null;
            const nNormalCardCount = oSettings.nStartingNormalCardCount || 4;
            const nSpecialCardCount = oSettings.nStartingSpecialCardCount || 3;
            const nActionCardCount = oSettings.nStartingActionCardCount || 0;
            this.aHand.push(...aNormalCards.splice(0, nNormalCardCount));
            this.aHand.push(...aSpecialCards.splice(0, nSpecialCardCount));
            this.aHand.push(...aActionCards.splice(0, nActionCardCount));
            yield this.update({ aHand: this.aHand });
            yield oTable.update({ aDrawPile: Object.assign(Object.assign(Object.assign({}, aNormalCards), aActionCards), aSpecialCards) });
            this.emit('resHand', { aHand: this.aHand });
            return true;
        });
    }
    reconnect(sSocketId, eTableState) {
        return __awaiter(this, void 0, void 0, function* () {
            const stateMapper = { waiting: 'waiting', initialized: 'waiting', running: 'playing', finished: 'left' };
            yield this.update({ sSocketId, eState: stateMapper[eTableState] });
            log.debug(`${_.now()} client: ${this.iPlayerId} reconnected to table : ${this.iBattleId} with socketId : ${sSocketId}`);
            return true;
        });
    }
    emit(sEventName, oData = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sEventName)
                return false;
            if (this.sSocketId)
                global.io.to(this.sSocketId).emit(this.iBattleId, _.stringify(Object.assign({ sTaskName: sEventName }, oData)));
            if (process.env.NODE_ENV !== 'prod')
                global.io.to(this.sSocketId).emit('postman', _.stringify(Object.assign({ sTaskName: sEventName }, oData)));
            return true;
        });
    }
    toJSON() {
        return {
            iPlayerId: this.iPlayerId,
            iBattleId: this.iBattleId,
            sPlayerName: this.sPlayerName,
            sSocketId: this.sSocketId,
            nSeat: this.nSeat,
            nScore: this.nScore,
            nUnoTime: this.nUnoTime,
            nGraceTime: this.nGraceTime,
            nMissedTurn: this.nMissedTurn,
            nDrawNormal: this.nDrawNormal,
            nReconnectionAttempt: this.nReconnectionAttempt,
            bSpecialMeterFull: this.bSpecialMeterFull,
            aHand: this.aHand,
            eState: this.eState,
            dCreatedAt: this.dCreatedAt,
        };
    }
}
exports.default = Service;
