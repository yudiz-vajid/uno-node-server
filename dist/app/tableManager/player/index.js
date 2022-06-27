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
            const nCardToDiscardIndex = this.aHand.findIndex(card => card.iCardId === oData.iCardId);
            if (nCardToDiscardIndex === -1) {
                callback({ oData: {}, status: util_1.response.CARD_NOT_IN_HAND });
                return (_a = (log.silly(`no card found for iCardId: ${oData.iCardId}`) && null)) !== null && _a !== void 0 ? _a : false;
            }
            if (!this.aHand.length) {
                callback({ oData: {}, status: util_1.response.EMPTY_HAND });
                return (_b = (log.silly(`no cards in hand `) && null)) !== null && _b !== void 0 ? _b : false;
            }
            const [oCardToDiscard] = this.aHand.splice(nCardToDiscardIndex, 1);
            if (!oCardToDiscard) {
                callback({ oData: {}, status: util_1.response.SERVER_ERROR });
                return (_c = (log.error(`no card found for iCardId: ${oData.iCardId}`) && null)) !== null && _c !== void 0 ? _c : false;
            }
            callback({ oData: { nHandScore: yield this.handCardCounts(this.aHand) }, status: util_1.response.SUCCESS });
            const aPromises = [];
            let iSkipPlayer;
            let bIsReverseCard = false;
            if (oCardToDiscard.nLabel < 13) {
                if (oCardToDiscard.nLabel === 10)
                    iSkipPlayer = yield this.assignSkipCard(oTable);
                if (oCardToDiscard.nLabel === 11) {
                    oTable.toJSON().bTurnClockwise = !(oTable.toJSON().bTurnClockwise);
                    oTable.toJSON().bIsReverseNow = true;
                    bIsReverseCard = yield oTable.handleReverseCard();
                }
                aPromises.push(oTable.update({ eNextCardColor: oCardToDiscard.eColor, nDrawCount: oCardToDiscard.nLabel < 12 ? 1 : 2 }));
            }
            else {
                aPromises.push(oTable.update({ nDrawCount: oCardToDiscard.nLabel === 13 ? 1 : 4 }));
            }
            aPromises.push(oTable.addToDiscardPile(oCardToDiscard));
            const nRemainingGraceTime = yield oTable.getTTL('assignGraceTimerExpired', this.iPlayerId);
            if (nRemainingGraceTime) {
                this.nGraceTime = nRemainingGraceTime;
                aPromises.push(oTable.deleteScheduler(`assignGraceTimerExpired`, this.iPlayerId));
            }
            else {
                aPromises.push(oTable.deleteScheduler(`assignTurnTimerExpired`, this.iPlayerId));
            }
            aPromises.push(this.update({ aHand: this.aHand, nGraceTime: this.nGraceTime }));
            yield Promise.all(aPromises);
            oTable.emit('resDiscardPile', { iPlayerId: this.iPlayerId, oCard: oCardToDiscard, nHandCardCount: this.aHand.length });
            if (iSkipPlayer)
                oTable.emit('resUserSkip', { iPlayerId: iSkipPlayer });
            if (bIsReverseCard)
                oTable.emit('resReverseTurn', { bTurnClockwise: oTable.toJSON().bTurnClockwise });
            oTable.emit('resNextCardDetail', { eColor: oTable.toJSON().eNextCardColor, nDrawCount: oTable.toJSON().nDrawCount });
            if (oCardToDiscard.nLabel > 12) {
                this.wildCardColorTimer(oTable);
            }
            else {
                this.passTurn(oTable);
            }
            return true;
        });
    }
    drawCard(oData, oTable, callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`${_.now()} event: drawCard, player: ${this.iPlayerId}`);
            const aCard = this.bSpecialMeterFull ? oTable.drawCard('special', 1) : oTable.drawCard('normal', 1);
            if (!aCard) {
                callback({ oData: {}, status: util_1.response.SERVER_ERROR });
                return (_a = (log.error(`${_.now()} no card found for iCardId: ${oData.iCardId}`) && null)) !== null && _a !== void 0 ? _a : false;
            }
            const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
            this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
            this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;
            log.verbose(`${_.now()} player: ${this.iPlayerId}, drawnCard: ${aCard[0].iCardId}`);
            let isPlayableCard = yield this.checkPlayableCard(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor, aCard[0]);
            callback({ oData: { oCard: aCard[0], nDrawNormal: this.nDrawNormal, nSpecialMeterFillCount, bIsPlayable: isPlayableCard, nHandScore: yield this.handCardCounts() }, status: util_1.response.SUCCESS });
            oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, aCard: [], nCardCount: 1, nHandCardCount: this.aHand.length + 1 });
            yield Promise.all([
                oTable.updateDrawPile(),
                this.update({ nDrawNormal: this.nDrawNormal, bSpecialMeterFull: this.bSpecialMeterFull, aHand: [...this.aHand, ...aCard] }),
            ]);
            if (!isPlayableCard) {
                let aPromises = [];
                const nRemainingGraceTime = yield oTable.getTTL('assignGraceTimerExpired', this.iPlayerId);
                if (nRemainingGraceTime) {
                    this.nGraceTime = nRemainingGraceTime;
                    aPromises.push(oTable.deleteScheduler(`assignGraceTimerExpired`, this.iPlayerId));
                }
                else {
                    aPromises.push(oTable.deleteScheduler(`assignTurnTimerExpired`, this.iPlayerId));
                }
                yield Promise.all([
                    ...aPromises,
                    this.update({ nGraceTime: this.nGraceTime }),
                ]);
                this.passTurn(oTable);
            }
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
            aPromises.push(this.update({ nGraceTime: this.nGraceTime }));
            yield Promise.all(aPromises);
            this.passTurn(oTable);
            callback({ oData: {}, status: util_1.response.SUCCESS });
            return true;
        });
    }
    setWildCardColor(oData, oTable, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('setWildCardColor called.... ', oData);
            log.verbose(`${_.now()} event: setWildCardColor, player: ${this.iPlayerId}`);
            const aPromises = [];
            const nRemainingTime = yield oTable.getTTL('assignWildCardColorTimerExpired', this.iPlayerId);
            if (!nRemainingTime) {
                callback({ oData: {}, status: util_1.response.SUCCESS });
            }
            else {
                aPromises.push(oTable.deleteScheduler(`assignWildCardColorTimerExpired`, this.iPlayerId));
            }
            let updatedDiscardPile = [...oTable.toJSON().aDiscardPile];
            updatedDiscardPile[updatedDiscardPile.length - 1].eColor = oData.eColor;
            oTable.emit('resWildCardColor', { iPlayerId: this.iPlayerId, eColor: oData.eColor });
            aPromises.push(oTable.update({ eNextCardColor: oData.eColor, aDiscardPile: updatedDiscardPile }));
            yield Promise.all(aPromises);
            this.passTurn(oTable);
            return true;
        });
    }
}
exports.default = Player;
