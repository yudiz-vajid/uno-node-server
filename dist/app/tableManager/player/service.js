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
        this.sStartingHand = oData.sStartingHand;
        this.nSeat = oData.nSeat;
        this.nScore = oData.nScore;
        this.nUnoTime = oData.nUnoTime;
        this.nGraceTime = oData.nGraceTime;
        this.nMissedTurn = oData.nMissedTurn;
        this.nDrawNormal = oData.nDrawNormal;
        this.nUsedNormalCard = oData.nUsedNormalCard;
        this.nUsedActionCard = oData.nUsedActionCard;
        this.nUsedSpecialCard = oData.nUsedSpecialCard;
        this.nDrawnNormalCard = oData.nDrawnNormalCard;
        this.nDrawnSpecialCard = oData.nDrawnSpecialCard;
        this.nStartHandSum = oData.nStartHandSum;
        this.nReconnectionAttempt = oData.nReconnectionAttempt;
        this.nSkipUsed = oData.nSkipUsed;
        this.nReverseUsed = oData.nReverseUsed;
        this.nDraw2Used = oData.nDraw2Used;
        this.nDraw4Used = oData.nDraw4Used;
        this.nWildUsed = oData.nWildUsed;
        this.bSpecialMeterFull = oData.bSpecialMeterFull;
        this.bUnoDeclared = oData.bUnoDeclared;
        this.bNextTurnSkip = oData.bNextTurnSkip;
        this.bSkipSpecialMeterProcess = oData.bSkipSpecialMeterProcess;
        this.aHand = oData.aHand;
        this.eState = oData.eState;
        this.dCreatedAt = oData.dCreatedAt;
    }
    update(oData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aPromise = [];
                const sPlayerKey = _.getPlayerKey(this.iBattleId, this.iPlayerId);
                Object.entries(oData).forEach(([k, v]) => {
                    switch (k) {
                        case 'sSocketId':
                            this.sSocketId = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'sStartingHand':
                            this.sStartingHand = v;
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
                        case 'nStartHandSum':
                            this.nStartHandSum = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nReconnectionAttempt':
                            this.nReconnectionAttempt = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nUsedNormalCard':
                            this.nUsedNormalCard = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nUsedActionCard':
                            this.nUsedActionCard = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nUsedSpecialCard':
                            this.nUsedSpecialCard = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nDrawnNormalCard':
                            this.nDrawnNormalCard = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'nDrawnSpecialCard':
                            this.nDrawnSpecialCard = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'bSpecialMeterFull':
                            this.bSpecialMeterFull = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'bNextTurnSkip':
                            this.bNextTurnSkip = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'bUnoDeclared':
                            this.bUnoDeclared = v;
                            aPromise.push(redis.client.json.SET(sPlayerKey, `.${k}`, v));
                            break;
                        case 'bSkipSpecialMeterProcess':
                            this.bSkipSpecialMeterProcess = v;
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
    reconnect(sSocketId, oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            const stateMapper = { waiting: 'waiting', initialized: 'waiting', running: 'playing', finished: 'left' };
            yield this.update({ sSocketId, eState: stateMapper[oTable.toJSON().eState] });
            yield this.getGameState(oTable);
            log.debug(`${_.now()} client: ${this.iPlayerId} reconnected to table : ${this.iBattleId} with socketId : ${sSocketId}`);
            return true;
        });
    }
    emit(sEventName, oData = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sEventName)
                return false;
            if (this.sSocketId)
                global.io.to(this.sSocketId).emit(this.iBattleId, _.stringify({ sTaskName: sEventName, oData }));
            if (process.env.NODE_ENV !== 'prod')
                global.io.to(this.sSocketId).emit('postman', { sTaskName: sEventName, oData });
            return true;
        });
    }
    setHand(aNormalCard, aActionCard, aWildCard) {
        return __awaiter(this, void 0, void 0, function* () {
            this.aHand.push(...aNormalCard);
            this.aHand.push(...aActionCard);
            this.aHand.push(...aWildCard);
            const handScore = yield this.handCardCounts(this.aHand);
            const startingHand = this.aHand.map(c => c.iCardId).join(';');
            yield this.update({ aHand: this.aHand, eState: 'playing', nStartHandSum: handScore, sStartingHand: startingHand });
            this.emit('resHand', { aHand: this.aHand, nHandScore: yield this.handCardCounts() });
        });
    }
    getPlayableCardIds(oDiscardPileTopCard, eNextCardColor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!oDiscardPileTopCard || oDiscardPileTopCard === undefined)
                return this.aHand;
            if (oDiscardPileTopCard.nLabel === 12)
                return this.aHand.filter(card => card.nLabel > 12 || card.nLabel === 12 || oDiscardPileTopCard.eColor === card.eColor).map(card => card.iCardId);
            if (oDiscardPileTopCard.nLabel === 14)
                return this.aHand.filter(card => card.nLabel > 12 || card.nLabel === 14 || oDiscardPileTopCard.eColor === card.eColor).map(card => card.iCardId);
            if (oDiscardPileTopCard.nLabel === 13)
                return this.aHand.filter(card => card.nLabel > 12 || card.eColor === oDiscardPileTopCard.eColor).map(card => card.iCardId);
            return this.aHand
                .filter(card => oDiscardPileTopCard.eColor === card.eColor || oDiscardPileTopCard.nLabel === card.nLabel || card.nLabel === 13 || card.nLabel === 14)
                .map(card => card.iCardId);
        });
    }
    getGameState(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            const iUserTurn = oTable.toJSON().iPlayerTurn;
            log.verbose('getGameState called...');
            const nRemainingGraceTime = yield oTable.getTTL('assignGraceTimerExpired', iUserTurn);
            const ttl = nRemainingGraceTime || (yield oTable.getTTL('assignTurnTimerExpired', iUserTurn));
            const aPlayer = oTable.toJSON().aPlayer.map((p) => ({
                iPlayerId: p.iPlayerId,
                sPlayerName: p.sPlayerName,
                sSocketId: p.sSocketId,
                nSeat: p.nSeat,
                nHandCardCount: p.aHand.length,
                eState: p.eState,
            }));
            const oData = {
                oTable: Object.assign(Object.assign({}, oTable), { aPlayer, aDrawPile: [] }),
                myHand: this.aHand,
                oTurnInfo: {
                    iUserTurn,
                    ttl,
                    nTotalTurnTime: nRemainingGraceTime ? oTable.toJSON().oSettings.nGraceTime : oTable.toJSON().oSettings.nTurnTime,
                    bIsGraceTimer: !!nRemainingGraceTime,
                    aPlayableCards: iUserTurn === this.iPlayerId ? yield this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor) : [],
                },
            };
            yield this.emit('resGameState', oData);
        });
    }
    getStackingCardIds(oDiscardPileTopCard) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oDiscardPileTopCard.nLabel === 12)
                return this.aHand.filter(card => card.nLabel === 12).map(card => card.iCardId);
            if (oDiscardPileTopCard.nLabel === 14)
                return this.aHand.filter(card => card.nLabel === 14).map(card => card.iCardId);
        });
    }
    handCardCounts(aHand = this.aHand) {
        return __awaiter(this, void 0, void 0, function* () {
            const nPlayerScore = aHand.reduce((p, c) => p + c.nScore, 0);
            return nPlayerScore;
        });
    }
    autoPickCard(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`${_.now()} event: autoPickCard, player: ${this.iPlayerId}`);
            const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
            const aCard = this.bSpecialMeterFull ? yield oTable.drawCard('special', 1) : yield oTable.drawCard('normal', 1);
            this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
            this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;
            const aPromise = [];
            if (this.bUnoDeclared && this.aHand.length + 1 > 2)
                aPromise.push(this.update({ bUnoDeclared: false }));
            yield Promise.all([
                oTable.updateDrawPile(),
                ...aPromise,
                this.update({ nDrawNormal: this.nDrawNormal, bSpecialMeterFull: this.bSpecialMeterFull, aHand: [...this.aHand, ...aCard] }),
            ]);
            this.emit('resDrawCard', {
                iPlayerId: this.iPlayerId,
                aCard: [aCard[0]],
                nCardCount: 1,
                nDrawNormal: this.nDrawNormal,
                nSpecialMeterFillCount: oTable.toJSON().oSettings.nSpecialMeterFillCount,
                nHandCardCount: this.aHand.length,
                nHandScore: yield this.handCardCounts(),
                eReason: 'autoDraw',
            });
            oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, aCard: [], nCardCount: 1, nHandCardCount: this.aHand.length, eReason: 'autoDraw' }, [this.iPlayerId]);
            yield _.delay(300);
        });
    }
    assignUnoMissPenalty(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`${_.now()} event: autoPickCard, player: ${this.iPlayerId}`);
            const aCard = [];
            const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
            for (let i = 0; i < 2; i += 1) {
                const oCard = this.bSpecialMeterFull ? yield oTable.drawCard('special', 1) : yield oTable.drawCard('normal', 1);
                this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
                this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;
                aCard.push(...oCard);
            }
            yield Promise.all([oTable.updateDrawPile(), this.update({ nDrawNormal: this.nDrawNormal, bSpecialMeterFull: this.bSpecialMeterFull, aHand: [...this.aHand, ...aCard] })]);
            this.emit('resDrawCard', {
                iPlayerId: this.iPlayerId,
                aCard,
                nCardCount: 2,
                nDrawNormal: this.nDrawNormal,
                nSpecialMeterFillCount: oTable.toJSON().oSettings.nSpecialMeterFillCount,
                nHandCardCount: this.aHand.length,
                nHandScore: yield this.handCardCounts(),
                eReason: 'unoMissPenalty',
            });
            oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, aCard: [], nCardCount: 2, nHandCardCount: this.aHand.length, eReason: 'unoMissPenalty' }, [this.iPlayerId]);
            yield _.delay(300 * 2);
        });
    }
    checkPlayableCard(oDiscardPileTopCard, eNextCardColor, oUserCard) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oDiscardPileTopCard.nLabel === 12)
                return oUserCard.nLabel === 12 || oUserCard.eColor === oDiscardPileTopCard.eColor;
            if (oDiscardPileTopCard.nLabel === 14)
                return oUserCard.nLabel === 14 || oUserCard.eColor === oDiscardPileTopCard.eColor;
            if (oDiscardPileTopCard.nLabel === 13)
                return oUserCard.nLabel > 12 || oUserCard.eColor === oDiscardPileTopCard.eColor;
            return oDiscardPileTopCard.eColor === oUserCard.eColor || oDiscardPileTopCard.nLabel === oUserCard.nLabel || oUserCard.nLabel === 13 || oUserCard.nLabel === 14;
        });
    }
    assignSkipCard(oTable) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (oTable.toJSON().eState !== 'running')
                return log.error('table is not in running state.');
            const { aPlayer } = oTable.toJSON();
            const aPlayingPlayer = aPlayer.filter(p => p.eState === 'playing');
            if (!aPlayingPlayer.length)
                return (_a = (log.error('no playing participant') && null)) !== null && _a !== void 0 ? _a : false;
            const oNextPlayer = yield oTable.getNextPlayer(this.nSeat);
            if (!oNextPlayer)
                return (_b = (log.error('No playing player found...') && null)) !== null && _b !== void 0 ? _b : false;
            yield oNextPlayer.update({ bNextTurnSkip: true });
            return oNextPlayer.iPlayerId;
        });
    }
    skipPlayer(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            this.bNextTurnSkip = false;
            yield this.update({ bNextTurnSkip: this.bNextTurnSkip });
            this.passTurn(oTable);
        });
    }
    assignDrawPenalty(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            const aCard = [];
            const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
            for (let i = 0; i < oTable.toJSON().nDrawCount; i += 1) {
                const oCard = this.bSpecialMeterFull ? yield oTable.drawCard('special', 1) : yield oTable.drawCard('normal', 1);
                if (!this.bSkipSpecialMeterProcess) {
                    this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
                    this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;
                }
                aCard.push(...oCard);
            }
            yield oTable.updateDrawPile();
            yield this.update({ nDrawNormal: this.nDrawNormal, bSpecialMeterFull: this.bSpecialMeterFull, aHand: [...this.aHand, ...aCard], bUnoDeclared: false });
            yield oTable.update({ iDrawPenltyPlayerId: '', nDrawCount: 0 });
            this.emit('resDrawCard', {
                iPlayerId: this.iPlayerId,
                aCard,
                nCardCount: aCard.length,
                nHandCardCount: this.aHand.length,
                nDrawNormal: this.nDrawNormal,
                nSpecialMeterFillCount,
                nHandScore: yield this.handCardCounts(),
                eReason: 'drawCardPenalty',
            });
            oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, aCard: [], nCardCount: aCard.length, nHandCardCount: this.aHand.length, eReason: 'drawCardPenalty' }, [this.iPlayerId]);
            yield _.delay(300 * aCard.length);
        });
    }
    takeTurn(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield _.delay(600);
            yield oTable.update({ iPlayerTurn: this.iPlayerId });
            let aStackingCardId = [];
            if (oTable.toJSON().aDiscardPile.slice(-1)[0].nLabel === 12 || oTable.toJSON().aDiscardPile.slice(-1)[0].nLabel === 14) {
                if (oTable.toJSON().oSettings.bStackingDrawCards && oTable.toJSON().iDrawPenltyPlayerId === this.iPlayerId) {
                    aStackingCardId = yield this.getStackingCardIds(oTable.getDiscardPileTopCard());
                    if (!(aStackingCardId === null || aStackingCardId === void 0 ? void 0 : aStackingCardId.length))
                        yield this.assignDrawPenalty(oTable);
                    if (!(aStackingCardId === null || aStackingCardId === void 0 ? void 0 : aStackingCardId.length) && oTable.toJSON().oSettings.bSkipTurnOnDrawTwoOrFourCard)
                        return this.skipPlayer(oTable);
                }
                else if (oTable.toJSON().iDrawPenltyPlayerId === this.iPlayerId) {
                    yield this.assignDrawPenalty(oTable);
                    if (oTable.toJSON().oSettings.bSkipTurnOnDrawTwoOrFourCard)
                        return this.skipPlayer(oTable);
                }
            }
            if (this.bNextTurnSkip)
                return this.skipPlayer(oTable);
            const aPlayableCardId = aStackingCardId.length ? aStackingCardId : yield this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
            log.debug(`${_.now()} discard pile top card:: ${oTable.getDiscardPileTopCard().iCardId}`);
            log.debug(`${_.now()} playable cards for player ${this.iPlayerId}:: ${aPlayableCardId}`);
            this.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nTurnTime - 500, timestamp: Date.now(), aPlayableCards: aPlayableCardId });
            oTable.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: oTable.toJSON().oSettings.nTurnTime - 500, timestamp: Date.now(), aPlayableCards: [] }, [this.iPlayerId]);
            oTable.setSchedular('assignTurnTimerExpired', this.iPlayerId, oTable.toJSON().oSettings.nTurnTime);
            return true;
        });
    }
    assignTurnTimerExpired(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nGraceTime < 3)
                return this.assignGraceTimerExpired(oTable);
            let aStackingCardId = [];
            if (oTable.toJSON().aDiscardPile.slice(-1)[0].nLabel === 12 || oTable.toJSON().aDiscardPile.slice(-1)[0].nLabel === 14) {
                if (oTable.toJSON().oSettings.bStackingDrawCards && oTable.toJSON().iDrawPenltyPlayerId === this.iPlayerId) {
                    aStackingCardId = yield this.getStackingCardIds(oTable.getDiscardPileTopCard());
                }
            }
            const aPlayableCardId = aStackingCardId.length ? aStackingCardId : yield this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
            this.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: this.nGraceTime - 500, timestamp: Date.now(), aPlayableCards: aPlayableCardId });
            oTable.emit('resTurnTimer', { bIsGraceTimer: true, iPlayerId: this.iPlayerId, ttl: this.nGraceTime - 500, timestamp: Date.now(), aPlayableCards: [] }, [this.iPlayerId]);
            oTable.setSchedular('assignGraceTimerExpired', this.iPlayerId, this.toJSON().nGraceTime);
            return true;
        });
    }
    assignGraceTimerExpired(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update({ nMissedTurn: this.nMissedTurn + 1, nGraceTime: 0 });
            const aPlayableCardId = yield this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
            if (oTable.toJSON().iDrawPenltyPlayerId === this.iPlayerId && (!aPlayableCardId.length || (aPlayableCardId.length && oTable.toJSON().oSettings.bMustCollectOnMissTurn))) {
                yield this.assignDrawPenalty(oTable);
            }
            else if (!aPlayableCardId.length)
                this.autoPickCard(oTable);
            else if (aPlayableCardId.length && oTable.toJSON().oSettings.bMustCollectOnMissTurn)
                this.autoPickCard(oTable);
            oTable.emit('resTurnMissed', { iPlayerId: this.iPlayerId, nMissedTurn: this.nMissedTurn });
            if (this.nMissedTurn >= oTable.toJSON().oSettings.nTotalSkipTurnCount)
                return yield this.leftPlayer(oTable, 'missTurnLimit');
            return this.passTurn(oTable);
        });
    }
    assignWildCardColorTimerExpired(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            const randomColor = _.randomizeArray(['red', 'green', 'blue', 'yellow']);
            const updatedDiscardPile = [...oTable.toJSON().aDiscardPile];
            updatedDiscardPile[updatedDiscardPile.length - 1].eColor = randomColor[0];
            yield oTable.update({ aDiscardPile: updatedDiscardPile });
            oTable.emit('resWildCardColor', { iPlayerId: this.iPlayerId, eColor: randomColor[0] });
            return this.passTurn(oTable);
        });
    }
    leftPlayer(oTable, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield _.delay(600);
            yield this.update({ eState: 'left' });
            oTable.emit('resPlayerLeft', { iPlayerId: this.iPlayerId });
            const aPlayingPlayer = oTable.toJSON().aPlayer.filter(p => p.eState === 'playing');
            if (aPlayingPlayer.length <= 1)
                return oTable.gameOver(aPlayingPlayer[0], 'playerLeft');
            return this.passTurn(oTable);
        });
    }
    passTurn(oTable) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (oTable.toJSON().eState !== 'running')
                return log.error('table is not in running state.');
            if (!this.aHand.length) {
                if (oTable.toJSON().iDrawPenltyPlayerId) {
                    const penaltyPlayer = oTable.getPlayer(oTable.toJSON().iDrawPenltyPlayerId);
                    if ((penaltyPlayer === null || penaltyPlayer === void 0 ? void 0 : penaltyPlayer.eState) === 'playing')
                        yield penaltyPlayer.assignDrawPenalty(oTable);
                }
                const winner = yield oTable.getPlayer(this.iPlayerId);
                oTable.update({ oWinningCard: oTable.getDiscardPileTopCard() });
                return oTable.gameOver(winner, 'playerWin');
            }
            const { aPlayer } = oTable.toJSON();
            const aPlayingPlayer = aPlayer.filter(p => p.eState === 'playing');
            if (!aPlayingPlayer.length)
                return (_a = (log.error('no playing participant') && null)) !== null && _a !== void 0 ? _a : false;
            let oNextPlayer;
            if (aPlayingPlayer.length === 2 && oTable.toJSON().aDiscardPile[oTable.toJSON().aDiscardPile.length - 1].nLabel === 11 && oTable.toJSON().bIsReverseNow) {
                oNextPlayer = yield oTable.getPlayer(this.iPlayerId);
                yield oTable.update({ bIsReverseNow: false });
            }
            else {
                oNextPlayer = yield oTable.getNextPlayer(this.nSeat);
            }
            if (!oNextPlayer)
                return (_b = (log.error('No playing player found...') && null)) !== null && _b !== void 0 ? _b : false;
            oNextPlayer.takeTurn(oTable);
            return true;
        });
    }
    wildCardColorTimer(oTable) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose('wildCardColorTimer...');
            if (oTable.toJSON().eState !== 'running')
                return log.error('table is not in running state.');
            oTable.setSchedular('assignWildCardColorTimerExpired', this.iPlayerId, oTable.toJSON().oSettings.nWildCardColorTimer);
            return true;
        });
    }
    toJSON() {
        return {
            iPlayerId: this.iPlayerId,
            iBattleId: this.iBattleId,
            sPlayerName: this.sPlayerName,
            sSocketId: this.sSocketId,
            sStartingHand: this.sStartingHand,
            nSeat: this.nSeat,
            nScore: this.nScore,
            nUnoTime: this.nUnoTime,
            nGraceTime: this.nGraceTime,
            nMissedTurn: this.nMissedTurn,
            nStartHandSum: this.nStartHandSum,
            nDrawNormal: this.nDrawNormal,
            nReconnectionAttempt: this.nReconnectionAttempt,
            nUsedNormalCard: this.nUsedNormalCard,
            nUsedActionCard: this.nUsedActionCard,
            nUsedSpecialCard: this.nUsedSpecialCard,
            nDrawnNormalCard: this.nDrawnNormalCard,
            nDrawnSpecialCard: this.nDrawnSpecialCard,
            nSkipUsed: this.nSkipUsed,
            nReverseUsed: this.nReverseUsed,
            nDraw2Used: this.nDraw2Used,
            nDraw4Used: this.nDraw4Used,
            nWildUsed: this.nWildUsed,
            bSpecialMeterFull: this.bSpecialMeterFull,
            bSkipSpecialMeterProcess: this.bSkipSpecialMeterProcess,
            aHand: this.aHand,
            eState: this.eState,
            dCreatedAt: this.dCreatedAt,
        };
    }
}
exports.default = Service;
