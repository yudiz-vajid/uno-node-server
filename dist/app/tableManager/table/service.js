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
Object.defineProperty(exports, "__esModule", { value: true });
class Service {
    constructor(oData) {
        var _a;
        this.iBattleId = oData.iBattleId;
        this.iPlayerTurn = oData.iPlayerTurn;
        this.iSkippedPLayer = oData.iSkippedPLayer;
        this.iDrawPenltyPlayerId = oData.iDrawPenltyPlayerId;
        this.aPlayerId = oData.aPlayerId;
        this.aDrawPile = oData.aDrawPile;
        this.aDiscardPile = oData.aDiscardPile;
        this.bToSkip = oData.bToSkip;
        this.eState = oData.eState;
        this.bTurnClockwise = oData.bTurnClockwise;
        this.bIsReverseNow = oData.bIsReverseNow;
        this.eNextCardColor = oData.eNextCardColor;
        this.nDrawCount = oData.nDrawCount;
        this.dCreatedAt = oData.dCreatedAt;
        this.oSettings = oData.oSettings;
        this.aPlayer = (_a = oData.aPlayer) !== null && _a !== void 0 ? _a : [];
    }
    distributeCards() {
        log.info(this.aDrawPile);
    }
    update(oDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aPromise = [];
                const sTableKey = h.getTableKey(this.iBattleId);
                Object.entries(oDate).forEach(([k, v]) => {
                    switch (k) {
                        case 'iPlayerTurn':
                            this.iPlayerTurn = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'iSkippedPLayer':
                            this.iSkippedPLayer = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'iDrawPenltyPlayerId':
                            this.iDrawPenltyPlayerId = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'aPlayerId':
                            this.aPlayerId = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'aDrawPile':
                            this.aDrawPile = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'aDiscardPile':
                            this.aDiscardPile = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'bToSkip':
                            this.bToSkip = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'eState':
                            this.eState = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'bTurnClockwise':
                            this.bTurnClockwise = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'bIsReverseNow':
                            this.bIsReverseNow = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'eNextCardColor':
                            this.eNextCardColor = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'nDrawCount':
                            this.nDrawCount = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        case 'oSettings':
                            this.oSettings = v;
                            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v));
                            break;
                        default:
                            break;
                    }
                });
                const aRedisSetResponse = (yield Promise.all(aPromise));
                if (aRedisSetResponse.some(ok => !ok))
                    log.error('Table.update: redis.client.json.SET failed for some key');
                return this.toJSON();
            }
            catch (err) {
                log.error(`Error Occurred on Table.update(). reason :${err.message}`);
                log.silly(this.toJSON());
                return null;
            }
        });
    }
    drawCard(eCardType, nCount) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const aCards = [];
            let skipSpecialMeter = false;
            switch (eCardType) {
                case 'normal':
                    for (let i = 0; i < nCount; i += 1) {
                        let nCardIndex = this.aDrawPile.findIndex(c => c.nLabel < 10);
                        if (nCardIndex === -1) {
                            yield this.reshuffleClosedDeck();
                            nCardIndex = this.aDrawPile.findIndex(c => c.nLabel < 10);
                        }
                        aCards.push(...this.aDrawPile.splice(nCardIndex, 1));
                    }
                    break;
                case 'action':
                    for (let i = 0; i < nCount; i += 1) {
                        let nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 9 && c.nLabel < 13);
                        if (nCardIndex === -1) {
                            yield this.reshuffleClosedDeck();
                            nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 9 && c.nLabel < 13);
                            if (nCardIndex === -1) {
                                nCardIndex = this.aDrawPile.findIndex(c => c.nLabel < 10);
                                skipSpecialMeter = true;
                            }
                        }
                        aCards.push(...this.aDrawPile.splice(nCardIndex, 1));
                    }
                    break;
                case 'wild':
                    for (let i = 0; i < nCount; i += 1) {
                        let nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 12);
                        if (nCardIndex === -1) {
                            yield this.reshuffleClosedDeck();
                            nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 12);
                            if (nCardIndex === -1) {
                                nCardIndex = this.aDrawPile.findIndex(c => c.nLabel < 10);
                                skipSpecialMeter = true;
                            }
                        }
                        aCards.push(...this.aDrawPile.splice(nCardIndex, 1));
                    }
                    break;
                case 'special':
                    for (let i = 0; i < nCount; i += 1) {
                        let nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 9);
                        if (nCardIndex === -1) {
                            yield this.reshuffleClosedDeck();
                            nCardIndex = this.aDrawPile.findIndex(c => c.nLabel > 9);
                            if (nCardIndex === -1) {
                                nCardIndex = this.aDrawPile.findIndex(c => c.nLabel < 10);
                                skipSpecialMeter = true;
                            }
                        }
                        aCards.push(...this.aDrawPile.splice(nCardIndex, 1));
                    }
                    break;
                default:
                    return (_a = (log.error(`drawCard called with invalid eCardType: ${eCardType}`) && null)) !== null && _a !== void 0 ? _a : null;
            }
            const player = yield this.getPlayer(this.iPlayerTurn);
            yield (player === null || player === void 0 ? void 0 : player.update({ bSkipSpecialMeterProcess: skipSpecialMeter }));
            return aCards;
        });
    }
    getPlayer(iPlayerId) {
        var _a;
        return (_a = this.aPlayer.find(oParticipant => oParticipant.toJSON().iPlayerId === iPlayerId)) !== null && _a !== void 0 ? _a : null;
    }
    reshuffleClosedDeck() {
        return __awaiter(this, void 0, void 0, function* () {
            this.aDrawPile = this.aDrawPile.length ? [...this.aDrawPile, ...this.aDiscardPile.splice(0, this.aDiscardPile.length - 1)] : this.aDiscardPile.splice(0, this.aDiscardPile.length - 1);
            for (let i = 0; i < this.aDrawPile.length; i++) {
                if (this.aDrawPile[i].nLabel > 12)
                    this.aDrawPile[i].eColor = "black";
            }
            yield this.update({ aDiscardPile: this.aDiscardPile, aDrawPile: this.aDrawPile });
            this.emit('resShuffleDeck', {});
        });
    }
    initializeGame() {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = this.toJSON(), { aDrawPile, aPlayer, aPlayerId } = _a, rest = __rest(_a, ["aDrawPile", "aPlayer", "aPlayerId"]);
            const aParticipant = this.toJSON().aPlayer.map(p => {
                const pJson = p.toJSON();
                return { iPlayerId: pJson.iPlayerId, nSeat: pJson.nSeat, nCardCount: pJson.aHand.length };
            });
            const ePreviousState = rest.eState;
            const bInitializeTable = aPlayerId.length == rest.oSettings.nTotalPlayerCount && rest.eState === 'waiting';
            rest.eState = bInitializeTable ? 'initialized' : rest.eState;
            this.emit('resTableState', { table: rest, aPlayer: aParticipant });
            if (ePreviousState === 'waiting' && rest.eState === 'initialized') {
                this.initializeGameTimer();
            }
        });
    }
    initializeGameTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            const nBeginCountdownCounter = this.oSettings.nGameInitializeTime;
            this.emit('resGameInitializeTimer', { ttl: nBeginCountdownCounter, timestamp: Date.now() });
            this.setSchedular('gameInitializeTimerExpired', '', nBeginCountdownCounter);
        });
    }
    addPlayer(oPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePlayerId = [...this.aPlayerId, oPlayer.toJSON().iPlayerId];
            const oUpdateTable = yield this.update({ aPlayerId: tablePlayerId });
            if (!oUpdateTable)
                return false;
            this.aPlayer.push(oPlayer);
            if (this.aPlayerId.length === this.oSettings.nTotalPlayerCount) {
                this.initializeGame();
            }
            return true;
        });
    }
    gameOver(oPlayer, eReason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update({ eState: 'finished' });
            const aPlayer = this.toJSON().aPlayer.filter(p => p.eState != 'left');
            for (let player of aPlayer) {
                yield player.update({ eState: 'declared' });
                player.nScore = yield player.handCardCounts(player.aHand);
            }
            const sortedPlayer = aPlayer.sort((a, b) => a.nScore - b.nScore).map((p, i) => { return { aHand: p.aHand, nScore: p.nScore, iPlayerId: p.iPlayerId, nRank: i }; });
            this.emit('resGameOver', { aPlayer: sortedPlayer, oWinner: oPlayer, eReason });
            const keys = yield redis.client.KEYS(`t:${this.iBattleId}:*`);
            if (keys.length)
                yield redis.client.del(keys);
            const schedularKey = yield redis.client.KEYS(`sch:${this.iBattleId}:`);
            if (schedularKey.length)
                yield redis.client.del(schedularKey);
            return true;
        });
    }
    updateDrawPile(aDrawPile) {
        return __awaiter(this, void 0, void 0, function* () {
            this.aDrawPile = aDrawPile !== null && aDrawPile !== void 0 ? aDrawPile : this.aDrawPile;
            yield this.update({ aDrawPile: this.aDrawPile });
        });
    }
    updateDiscardPile(aDiscardPile) {
        return __awaiter(this, void 0, void 0, function* () {
            this.aDiscardPile = aDiscardPile !== null && aDiscardPile !== void 0 ? aDiscardPile : this.aDiscardPile;
            yield this.update({ aDiscardPile: this.aDiscardPile });
        });
    }
    addToDiscardPile(oCard) {
        return __awaiter(this, void 0, void 0, function* () {
            this.aDiscardPile.push(oCard);
            yield this.update({ aDiscardPile: this.aDiscardPile });
        });
    }
    setSchedular(sTaskName = '', iPlayerId = '', nTimeMS = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!sTaskName)
                    return false;
                if (!nTimeMS)
                    return false;
                yield redis.client.pSetEx(h.getSchedulerKey(sTaskName, this.iBattleId, iPlayerId), nTimeMS, sTaskName);
                return true;
            }
            catch (err) {
                log.error(`table.setSchedular() failed.${{ reason: err.message, stack: err.stack }}`);
                return false;
            }
        });
    }
    deleteScheduler(sTaskName = '', iPlayerId = '*') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sKey = h.getSchedulerKey(sTaskName, this.iBattleId, iPlayerId);
                const schedularKeys = yield redis.client.keys(sKey);
                if (!schedularKeys.length)
                    throw new Error(`schedular doesn't exists`);
                const deletionCount = yield redis.client.del(schedularKeys);
                if (!deletionCount)
                    throw new Error(`can't delete key: ${schedularKeys}`);
                log.silly(`deleted scheduled keys: ${schedularKeys}`);
                return true;
            }
            catch (err) {
                log.error(`table.deleteScheduler(sTaskName: ${sTaskName}, iPlayerId: ${iPlayerId}, iBattleId: ${this.iBattleId}) failed. reason: ${err.message}`);
                return false;
            }
        });
    }
    handleReverseCard() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update({ bTurnClockwise: !(this.bTurnClockwise), bIsReverseNow: true });
            return true;
        });
    }
    getTTL(sTaskName = '', iPlayerId = '*') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sKey = h.getSchedulerKey(sTaskName, this.iBattleId, iPlayerId);
                const schedularKeys = yield redis.client.keys(sKey);
                if (!schedularKeys.length)
                    return null;
                if (schedularKeys.length > 1) {
                    log.warn(`multiple schedular keys found for ${sKey}, keys: ${schedularKeys}`);
                    yield redis.client.del(schedularKeys.slice(1));
                }
                const nTTL = yield redis.client.pTTL(schedularKeys[0]);
                if (nTTL < 0)
                    return null;
                return nTTL;
            }
            catch (err) {
                log.error(`table.getTTL(sTaskName: ${sTaskName}, iPlayerId: ${iPlayerId}, iBattleId: ${this.iBattleId}) failed. reason: ${err.message}`);
                return null;
            }
        });
    }
    emit(sEventName, oData, exceptPlayerId = []) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.aPlayer.forEach(p => !exceptPlayerId.includes(p.toJSON().iPlayerId) && p.emit(sEventName, oData));
                return true;
            }
            catch (err) {
                log.error('Table.emit() failed !!!', { reason: err.message });
                return false;
            }
        });
    }
    toJSON() {
        return {
            iBattleId: this.iBattleId,
            iPlayerTurn: this.iPlayerTurn,
            iSkippedPLayer: this.iSkippedPLayer,
            iDrawPenltyPlayerId: this.iDrawPenltyPlayerId,
            aPlayerId: this.aPlayerId,
            aDrawPile: this.aDrawPile,
            aDiscardPile: this.aDiscardPile,
            bToSkip: this.bToSkip,
            bIsReverseNow: this.bIsReverseNow,
            eState: this.eState,
            bTurnClockwise: this.bTurnClockwise,
            eNextCardColor: this.eNextCardColor,
            nDrawCount: this.nDrawCount,
            dCreatedAt: this.dCreatedAt,
            oSettings: this.oSettings,
            aPlayer: this.aPlayer,
        };
    }
}
exports.default = Service;
