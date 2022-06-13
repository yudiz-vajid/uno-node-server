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
        var _a, _b, _c, _d, _e;
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
            const aPromises = [];
            if (oCardToDiscard.nLabel < 13)
                aPromises.push(oTable.update({ eNextCardColor: oCardToDiscard.eColor, nDrawCount: oCardToDiscard.nLabel < 12 ? 1 : 2 }));
            else {
                if (!oData.eColor) {
                    callback({ oData: {}, status: util_1.response.CARD_COLOR_REQUIRED });
                    return (_d = (log.silly(`card color is required when discarding wild card`) && null)) !== null && _d !== void 0 ? _d : false;
                }
                if (oData.eColor === 'black') {
                    callback({ oData: {}, status: util_1.response.INVALID_NEXT_CARD_COLOR });
                    return (_e = (log.silly(`black as next card color is not allowed when discarding wild card`) && null)) !== null && _e !== void 0 ? _e : false;
                }
                aPromises.push(oTable.update({ eNextCardColor: oData.eColor, nDrawCount: oCardToDiscard.nLabel === 13 ? 1 : 4 }));
            }
            callback({ oData: {}, status: util_1.response.SUCCESS });
            oCardToDiscard.eColor = 'red';
            aPromises.push(oTable.addToDiscardPile(oCardToDiscard));
            const nRemainingGraceTime = yield oTable.getTTL('assignGraceTimerExpired', this.iPlayerId);
            if (nRemainingGraceTime) {
                this.nGraceTime = nRemainingGraceTime;
                aPromises.push(oTable.deleteScheduler(`assignGraceTimerExpired`, this.iPlayerId));
            }
            else {
                this.nGraceTime = 0;
                aPromises.push(oTable.deleteScheduler(`assignTurnTimerExpired`, this.iPlayerId));
            }
            aPromises.push(this.update({ aHand: this.aHand, nGraceTime: this.nGraceTime }));
            yield Promise.all(aPromises);
            oTable.emit('resDiscardPile', { iPlayerId: this.iPlayerId, oCard: oCardToDiscard });
            oTable.emit('resNextCardDetail', { eColor: oTable.toJSON().eNextCardColor, nDrawCount: oTable.toJSON().nDrawCount });
            this.passTurn(oTable);
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
            callback({ oData: { oCard: aCard[0], nDrawNormal: this.nDrawNormal, nSpecialMeterFillCount }, status: util_1.response.SUCCESS });
            oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, nCardCount: 1 });
            yield Promise.all([
                oTable.updateDrawPile(),
                this.update({ nDrawNormal: this.nDrawNormal, bSpecialMeterFull: this.bSpecialMeterFull, aHand: [...this.aHand, ...aCard] }),
            ]);
            return true;
        });
    }
}
exports.default = Player;
