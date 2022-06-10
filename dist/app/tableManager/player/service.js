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
const __1 = __importDefault(require(".."));
class Service {
    constructor(table, oData) {
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
        this.table = table;
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
                global.io.to(this.sSocketId).emit(this.iBattleId, _.stringify({ sTaskName: sEventName, oData: Object.assign({}, oData) }));
            if (process.env.NODE_ENV !== 'prod')
                global.io.to(this.sSocketId).emit('postman', _.stringify({ sTaskName: sEventName, oData: Object.assign({}, oData) }));
            return true;
        });
    }
    getPlayableCards() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.table.aDiscardPile.length)
                log.error('Discard pile is empty');
            console.log('user hand length in getPlayableCards :: ', this.aHand.length, this.iPlayerId);
            if (!this.aHand.length)
                log.error('User Hand is empty');
            const oOpenCard = this.table.aDiscardPile[0];
            const aPlayableCards = this.aHand.filter((card) => oOpenCard.eColor === card.eColor || oOpenCard.nLabel === card.nLabel || card.nLabel === 13 || card.nLabel === 14).map((c) => c.iCardId);
            return aPlayableCards;
        });
    }
    takeTurn() {
        return __awaiter(this, void 0, void 0, function* () {
            log.info('take turn called...');
            const table = yield __1.default.getTable(this.iBattleId);
            yield table.update({ iPlayerTurn: this.iPlayerId });
            const aPlayableCard = yield this.getPlayableCards();
            table.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: this.table.oSettings.nTurnTime, timestamp: Date.now(), aPlayableCards: aPlayableCard });
            table.setSchedular('assignTurnTimerExpired', this.iPlayerId, this.table.oSettings.nTurnTime);
        });
    }
    hasValidTurn() {
        return __awaiter(this, void 0, void 0, function* () {
            return _.isEqual(this.table.iPlayerTurn, this.iPlayerId);
        });
    }
    discardCard(body, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('discardCard called for ', this.iPlayerId);
            console.log('body  ', body);
            const cardIndex = this.aHand.findIndex((e) => _.isEqual(e.iCardId, body.iCardId));
            log.info('cardIndex :: ', cardIndex);
            log.info(cardIndex);
            let card;
            if (cardIndex === -1)
                card = this.aHand.pop();
            else
                card = this.aHand.splice(cardIndex, 1)[0];
            this.table.aDiscardPile.push(card);
            callback(null, { oData: { status: 'success' } });
            this.table.emit('resDiscardPile', { sTaskName: 'resDiscardPile', oData: { iPlayerId: this.iPlayerId, oCard: card } });
            const turnTimerData = yield this.table.getScheduler('assignTurnTimerExpired', this.iPlayerId);
            if (turnTimerData) {
                console.log('turnTimerData :: ', turnTimerData);
                this.table.deleteScheduler(`assignTurnTimerExpired`, this.iPlayerId);
            }
            else {
                const graceTimerData = yield this.table.getScheduler('assignGraceTimerExpired', this.iPlayerId);
                if (graceTimerData) {
                    const ttl = yield this.table.getSchedulerTTL(`assignGraceTimerExpired`, this.iPlayerId);
                    this.nGraceTime -= this.nGraceTime - ttl;
                    this.table.deleteScheduler(`assignGraceTimerExpired`, this.iPlayerId);
                }
            }
            yield this.update({ aHand: this.aHand, nGraceTime: this.nGraceTime });
            yield this.table.update({ aDiscardPile: this.table.aDiscardPile });
            this.passTurn();
        });
    }
    assignTurnTimerExpired() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.toJSON().nGraceTime < 3)
                return this.assignGraceTimerExpired();
            const aPlayableCard = yield this.getPlayableCards();
            this.table.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: this.toJSON().nGraceTime, timestamp: Date.now(), aPlayableCards: aPlayableCard });
            this.table.setSchedular('assignGraceTimerExpired', this.iPlayerId, this.toJSON().nGraceTime);
            return true;
        });
    }
    assignGraceTimerExpired() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('assignGraceTimerExpired called...');
            this.nGraceTime = 0;
            this.nMissedTurn += 1;
            yield this.update({ nMissedTurn: this.nMissedTurn });
            return this.passTurn();
        });
    }
    passTurn() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('passTurn called...');
            if (this.table.eState !== 'running')
                return log.error('table is not in running state.');
            const players = yield __1.default.getTablePlayers(this.iBattleId);
            const playingPlayers = players.filter((p) => p.eState === 'playing');
            if (playingPlayers.length === 0)
                return log.error('no playing participant');
            const nextParticipant = yield this.table.getNextParticipant(this.nSeat);
            if (!nextParticipant)
                log.verbose('No playing player found...');
            else
                nextParticipant.takeTurn();
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
