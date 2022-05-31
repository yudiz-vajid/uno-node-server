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
        var _a;
        this.iBattleId = oData.iBattleId;
        this.iPlayerTurn = oData.iPlayerTurn;
        this.iSkippedPLayer = oData.iSkippedPLayer;
        this.aPlayerId = oData.aPlayerId;
        this.aDrawPile = oData.aDrawPile;
        this.aDiscardPile = oData.aDiscardPile;
        this.bToSkip = oData.bToSkip;
        this.eState = oData.eState;
        this.eTurnDirection = oData.eTurnDirection;
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
                const sTableKey = _.getTableKey(this.iBattleId);
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
                        case 'eTurnDirection':
                            this.eTurnDirection = v;
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
    getPlayer(iPlayerId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.aPlayer.find(oParticipant => oParticipant.toJSON().iPlayerId === iPlayerId)) !== null && _a !== void 0 ? _a : null;
        });
    }
    initializeGame() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('initializeGame called ...');
        });
    }
    addPlayer(oPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            const tablePlayer = [...this.aPlayerId, oPlayer.toJSON().iPlayerId];
            const ePreviousState = this.eState;
            const bInitializeTable = tablePlayer.length === this.oSettings.nTotalPlayerCount && this.eState === 'waiting';
            console.log();
            this.eState = bInitializeTable ? 'initialized' : this.eState;
            const oUpdateTable = yield this.update({ aPlayerId: tablePlayer });
            if (!oUpdateTable)
                return false;
            this.aPlayer.push(oPlayer);
            if (ePreviousState === 'waiting' && this.eState === 'initialized') {
                console.log('Need to start the game....');
            }
            return true;
        });
    }
    emit(sEventName, oData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.aPlayer.forEach(p => p.emit(sEventName, oData));
            }
            catch (err) {
                log.error('Table.emit() failed !!!', { reason: err.message });
            }
        });
    }
    toJSON() {
        return {
            iBattleId: this.iBattleId,
            iPlayerTurn: this.iPlayerTurn,
            iSkippedPLayer: this.iSkippedPLayer,
            aPlayerId: this.aPlayerId,
            aDrawPile: this.aDrawPile,
            bToSkip: this.bToSkip,
            eState: this.eState,
            eTurnDirection: this.eTurnDirection,
            eNextCardColor: this.eNextCardColor,
            nDrawCount: this.nDrawCount,
            dCreatedAt: this.dCreatedAt,
            oSettings: this.oSettings,
            aPlayer: this.aPlayer,
        };
    }
}
exports.default = Service;
