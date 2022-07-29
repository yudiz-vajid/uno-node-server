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
const service_1 = __importDefault(require("./service"));
const util_1 = require("../../util");
class Player extends service_1.default {
    discardCard(oData, oTable, callback) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`event: discardCard, player: ${this.iPlayerId}, iCardId: ${oData.iCardId}`);
            let nCardToDiscardIndex = this.aHand.findIndex(card => card.iCardId === oData.iCardId);
            if (nCardToDiscardIndex === -1) {
                callback({ oData: {}, status: util_1.response.CARD_NOT_IN_HAND });
                return (_a = (log.silly(`no card found for iCardId: ${oData.iCardId}`) && null)) !== null && _a !== void 0 ? _a : false;
            }
            if (!this.aHand.length) {
                callback({ oData: {}, status: util_1.response.EMPTY_HAND });
                return (_b = (log.silly(`no cards in hand `) && null)) !== null && _b !== void 0 ? _b : false;
            }
            nCardToDiscardIndex = this.aHand.findIndex(card => card.iCardId === oData.iCardId);
            const [oCardToDiscard] = this.aHand.splice(nCardToDiscardIndex, 1);
            if (!oCardToDiscard) {
                callback({ oData: {}, status: util_1.response.SERVER_ERROR });
                return (_c = (log.error(`no card found for iCardId: ${oData.iCardId}`) && null)) !== null && _c !== void 0 ? _c : false;
            }
            callback({ oData: { nHandScore: yield this.handCardCounts(this.aHand) }, status: util_1.response.SUCCESS });
            const aPromises = [];
            let iSkipPlayer;
            let bIsReverseCard = false;
            let usedCard;
            if (oCardToDiscard.nLabel < 13) {
                if (oCardToDiscard.nLabel < 10)
                    usedCard = 'nUsedNormalCard';
                if (oCardToDiscard.nLabel === 10) {
                    iSkipPlayer = yield this.assignSkipCard(oTable);
                    usedCard = 'nUsedActionCard';
                    aPromises.push(this.update({ nSkipUsed: this.nSkipUsed + 1 }));
                }
                if (oCardToDiscard.nLabel === 11) {
                    oTable.toJSON().bTurnClockwise = !oTable.toJSON().bTurnClockwise;
                    oTable.toJSON().bIsReverseNow = true;
                    bIsReverseCard = yield oTable.handleReverseCard();
                    usedCard = 'nUsedActionCard';
                    aPromises.push(this.update({ nReverseUsed: this.nReverseUsed + 1 }));
                }
                if (oCardToDiscard.nLabel === 12) {
                    const iNextPlayerId = yield oTable.getNextPlayer(this.nSeat);
                    aPromises.push(oTable.update({ iDrawPenltyPlayerId: iNextPlayerId === null || iNextPlayerId === void 0 ? void 0 : iNextPlayerId.iPlayerId }));
                    usedCard = 'nUsedActionCard';
                    aPromises.push(this.update({ nDraw2Used: this.nDraw2Used + 1 }));
                }
                aPromises.push(oTable.update({
                    eNextCardColor: oCardToDiscard.eColor,
                    nDrawCount: oCardToDiscard.nLabel < 12 ? 1 : 2 + (oTable.toJSON().nDrawCount === 1 ? 0 : oTable.toJSON().nDrawCount),
                }));
            }
            else {
                const iNextPlayerId = yield oTable.getNextPlayer(this.nSeat);
                usedCard = 'nUsedSpecialCard';
                if (oCardToDiscard.nLabel === 13)
                    aPromises.push(this.update({ nWildUsed: this.nWildUsed + 1 }));
                else
                    aPromises.push(this.update({ nDraw4Used: this.nDraw4Used + 1 }));
                aPromises.push(oTable.update({
                    nDrawCount: oCardToDiscard.nLabel === 13 ? 1 : 4 + (oTable.toJSON().nDrawCount === 1 ? 0 : oTable.toJSON().nDrawCount),
                    iDrawPenltyPlayerId: oCardToDiscard.nLabel === 13 ? '' : iNextPlayerId === null || iNextPlayerId === void 0 ? void 0 : iNextPlayerId.iPlayerId,
                }));
            }
            aPromises.push(oTable.update({ iPlayerTurn: '' }));
            aPromises.push(oTable.addToDiscardPile(oCardToDiscard));
            const nRemainingGraceTime = yield oTable.getTTL('assignGraceTimerExpired', this.iPlayerId);
            if (nRemainingGraceTime) {
                this.nGraceTime = nRemainingGraceTime;
                aPromises.push(oTable.deleteScheduler(`assignGraceTimerExpired`, this.iPlayerId));
            }
            else {
                aPromises.push(oTable.deleteScheduler(`assignTurnTimerExpired`, this.iPlayerId));
            }
            let usedCardCount = this.nUsedNormalCard;
            if (usedCard === 'nUsedActionCard')
                usedCardCount = this.nUsedActionCard;
            else if (usedCard === 'nUsedSpecialCard')
                usedCardCount = this.nUsedSpecialCard;
            aPromises.push(this.update({ aHand: this.aHand, nGraceTime: this.nGraceTime, [usedCard]: usedCardCount + 1 }));
            yield Promise.all(aPromises);
            if (this.aHand.length === 1 && this.bUnoDeclared)
                oTable.emit('resUnoDeclare', { iPlayerId: this.iPlayerId });
            oTable.emit('resDiscardPile', { iPlayerId: this.iPlayerId, oCard: oCardToDiscard, nHandCardCount: this.aHand.length, nStackedCards: oTable.toJSON().nDrawCount });
            if (this.aHand.length === 1 && !this.bUnoDeclared) {
                yield _.delay(600);
                yield this.assignUnoMissPenalty(oTable);
            }
            if (this.aHand.length === 1 && this.bUnoDeclared)
                yield _.delay(1000);
            if (iSkipPlayer) {
                yield _.delay(600);
                oTable.emit('resUserSkip', { iPlayerId: iSkipPlayer });
                yield _.delay(2000);
            }
            if (bIsReverseCard) {
                yield _.delay(600);
                oTable.emit('resReverseTurn', { bTurnClockwise: oTable.toJSON().bTurnClockwise });
                yield _.delay(1500);
            }
            if (oCardToDiscard.nLabel > 12) {
                if (oCardToDiscard.nLabel === 14)
                    yield _.delay(1000);
                this.wildCardColorTimer(oTable);
            }
            else {
                if (oCardToDiscard.nLabel === 12)
                    yield _.delay(1500);
                this.passTurn(oTable);
            }
            return true;
        });
    }
    drawCard(oData, oTable, callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`${_.now()} event: drawCard, player: ${this.iPlayerId}`);
            if (!oTable.toJSON().aDrawPile.length)
                yield oTable.reshuffleClosedDeck();
            if (oTable.toJSON().iDrawPenltyPlayerId === this.iPlayerId) {
                callback({ oData: {}, status: util_1.response.SUCCESS });
                yield this.assignDrawPenalty(oTable);
                if (oTable.toJSON().oSettings.bSkipTurnOnDrawTwoOrFourCard) {
                    this.passTurn(oTable);
                }
                else {
                    const aPlayableCardId = yield this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
                    const remainingTurnTimer = yield oTable.getTTL('assignTurnTimerExpired', this.iPlayerId);
                    this.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: remainingTurnTimer - 500, timestamp: Date.now(), aPlayableCards: aPlayableCardId });
                    oTable.emit('resTurnTimer', { bIsGraceTimer: false, iPlayerId: this.iPlayerId, ttl: remainingTurnTimer - 500, timestamp: Date.now(), aPlayableCards: [] }, [
                        this.iPlayerId,
                    ]);
                }
                return true;
            }
            const aCard = this.bSpecialMeterFull ? yield oTable.drawCard('special', 1) : yield oTable.drawCard('normal', 1);
            if (!aCard || aCard === undefined) {
                callback({ oData: {}, status: util_1.response.SERVER_ERROR });
                return (_a = (log.error(`${_.now()} no card found for iCardId: ${oData.iCardId}`) && null)) !== null && _a !== void 0 ? _a : false;
            }
            const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
            if (!this.bSkipSpecialMeterProcess) {
                this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
                this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;
            }
            log.verbose(`${_.now()} player: ${this.iPlayerId}, drawnCard: ${aCard[0].iCardId}`);
            const isPlayableCard = yield this.checkPlayableCard(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor, aCard[0]);
            callback({ oData: {}, status: util_1.response.SUCCESS });
            const drawnCardType = aCard[0].nLabel < 10 ? 'nDrawnNormalCard' : 'nDrawnSpecialCard';
            const drawnCardCount = aCard[0].nLabel < 10 ? this.nDrawnNormalCard : this.nDrawnSpecialCard;
            this.emit('resDrawCard', {
                iPlayerId: this.iPlayerId,
                aCard: [aCard[0]],
                nDrawNormal: this.nDrawNormal,
                nSpecialMeterFillCount,
                bIsPlayable: isPlayableCard,
                nHandScore: yield this.handCardCounts(),
                eReason: 'normalDraw',
            });
            oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, aCard: [], nCardCount: 1, nHandCardCount: this.aHand.length + 1, eReason: 'normalDraw' }, [this.iPlayerId]);
            if (!isPlayableCard)
                yield oTable.update({ iPlayerTurn: '' });
            yield _.delay(300);
            const aPromise = [];
            yield Promise.all([
                ...aPromise,
                oTable.updateDrawPile(),
                this.update({ nDrawNormal: this.nDrawNormal, bSpecialMeterFull: this.bSpecialMeterFull, aHand: [...this.aHand, ...aCard] }),
            ]);
            if (!isPlayableCard) {
                const aPromises = [];
                const nRemainingGraceTime = yield oTable.getTTL('assignGraceTimerExpired', this.iPlayerId);
                if (nRemainingGraceTime) {
                    this.nGraceTime = nRemainingGraceTime;
                    aPromises.push(oTable.deleteScheduler(`assignGraceTimerExpired`, this.iPlayerId));
                }
                else {
                    aPromises.push(oTable.deleteScheduler(`assignTurnTimerExpired`, this.iPlayerId));
                }
                yield Promise.all([...aPromises, this.update({ nGraceTime: this.nGraceTime, bUnoDeclared: false }), oTable.update({ iDrawPenltyPlayerId: '' })]);
                this.passTurn(oTable);
            }
            return true;
        });
    }
    keepCard(oData, oTable, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`${_.now()} event: keepCard, player: ${this.iPlayerId}`);
            const aPromises = [];
            const nRemainingGraceTime = yield oTable.getTTL('assignGraceTimerExpired', this.iPlayerId);
            if (nRemainingGraceTime) {
                this.nGraceTime = nRemainingGraceTime;
                aPromises.push(oTable.deleteScheduler(`assignGraceTimerExpired`, this.iPlayerId));
            }
            else {
                aPromises.push(oTable.deleteScheduler(`assignTurnTimerExpired`, this.iPlayerId));
            }
            if (this.aHand.length <= 2 && this.aHand.length + 1 >= 2) {
                aPromises.push(this.update({ bUnoDeclared: false }));
                aPromises.push(oTable.update({ iDrawPenltyPlayerId: '' }));
            }
            aPromises.push(this.update({ nGraceTime: this.nGraceTime }));
            yield Promise.all(aPromises);
            this.passTurn(oTable);
            callback({ oData: {}, status: util_1.response.SUCCESS });
            return true;
        });
    }
    setWildCardColor(oData, oTable, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`${_.now()} event: setWildCardColor, player: ${this.iPlayerId}`);
            const aPromises = [];
            const nRemainingTime = yield oTable.getTTL('assignWildCardColorTimerExpired', this.iPlayerId);
            if (!nRemainingTime) {
                callback({ oData: {}, status: util_1.response.SUCCESS });
            }
            else {
                aPromises.push(oTable.deleteScheduler(`assignWildCardColorTimerExpired`, this.iPlayerId));
            }
            const updatedDiscardPile = [...oTable.toJSON().aDiscardPile];
            updatedDiscardPile[updatedDiscardPile.length - 1].eColor = oData.eColor;
            oTable.emit('resWildCardColor', { iPlayerId: this.iPlayerId, eColor: oData.eColor });
            aPromises.push(oTable.update({ eNextCardColor: oData.eColor, aDiscardPile: updatedDiscardPile }));
            yield Promise.all(aPromises);
            this.passTurn(oTable);
            return true;
        });
    }
    decalreUno(oData, oTable, callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`${_.now()} event: decalreUno, player: ${this.iPlayerId}`);
            const eligibleUno = this.aHand.length === 2;
            const playableCards = yield this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
            if (eligibleUno && playableCards.length) {
                yield this.update({ bUnoDeclared: true });
                callback({ oData: {}, status: util_1.response.SUCCESS });
            }
            else {
                callback({ oData: {}, status: util_1.response.WRONG_UNO });
                return (_a = (log.silly(`${_.now()} ${this.iPlayerId} has not valid uno.`) && null)) !== null && _a !== void 0 ? _a : false;
            }
            return true;
        });
    }
    leaveMatch(oData, oTable, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`${_.now()} event: leaveMatch, player: ${this.iPlayerId}`);
            yield this.update({ eState: 'left' });
            callback({ oData: {}, status: util_1.response.SUCCESS });
            oTable.emit('resPlayerLeft', { iPlayerId: this.iPlayerId });
            const aPlayingPlayer = oTable.toJSON().aPlayer.filter(p => p.eState === 'playing');
            if (aPlayingPlayer.length <= 1)
                return oTable.gameOver(aPlayingPlayer[0], 'playerLeft');
            if (oTable.toJSON().iPlayerTurn === this.iPlayerId)
                return this.passTurn(oTable);
            return true;
        });
    }
}
exports.default = Player;
