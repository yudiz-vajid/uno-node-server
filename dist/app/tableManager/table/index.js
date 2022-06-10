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
const service_1 = __importDefault(require("./service"));
class Table extends service_1.default {
    distributeCard() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { nStartingNormalCardCount, nStartingSpecialCardCount } = this.oSettings;
            const nInitialCardsPerUser = nStartingNormalCardCount + nStartingSpecialCardCount;
            if (this.aDrawPile.length <= this.aPlayer.length * nInitialCardsPerUser)
                return (_a = (log.error(`Not enough cards in the draw pile to distribute to all players`) && null)) !== null && _a !== void 0 ? _a : false;
            this.aPlayer.forEach((player) => __awaiter(this, void 0, void 0, function* () {
                var _c, _d;
                log.verbose(`length(drawPile): ${this.aDrawPile.length} `);
                const aNormalCard = this.drawCard('normal', nStartingNormalCardCount);
                if (!aNormalCard)
                    return (_c = (log.error(`Could not draw normal cards for player ${player.toJSON().iPlayerId}`) && null)) !== null && _c !== void 0 ? _c : false;
                const aWildCard = this.drawCard('wild', nStartingSpecialCardCount);
                if (!aWildCard)
                    return (_d = (log.error(`Could not draw wild cards for player ${player.toJSON().iPlayerId}`) && null)) !== null && _d !== void 0 ? _d : false;
                yield player.setHand(aNormalCard, aWildCard);
                return true;
            }));
            const oDiscardPileTopCard = this.drawCard('normal', 1);
            if (!oDiscardPileTopCard)
                return (_b = (log.error(`Could not draw discard pile top card`) && null)) !== null && _b !== void 0 ? _b : false;
            this.aDiscardPile.push(...oDiscardPileTopCard);
            yield this.updateDrawPile(this.aDrawPile);
            yield this.updateDiscardPile(this.aDiscardPile);
            yield this.update({ eState: 'running' });
            yield _.delay(5000);
            this.emit('resDiscardPileTopCard', { oDiscardPileTopCard: this.aDiscardPile[this.aDiscardPile.length - 1] });
            this.emit('resInitMasterTimer', { ttl: this.oSettings.nTotalGameTime, timestamp: Date.now() });
            this.setSchedular('masterTimerExpired', '', this.oSettings.nTotalGameTime);
            this.assignRandomTurn();
            return true;
        });
    }
    masterTimerExpired() {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose('masterTimerExpired, game should end now');
            this.emit('resMasterTimerExpired', {});
            return true;
        });
    }
    gameInitializeTimerExpired() {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose('gameInitializeTimerExpired, game should start now');
            this.emit('resGameInitializeTimerExpired', {});
            this.setSchedular('distributeCard', '', 2000);
            return true;
        });
    }
    getNextParticipant(previousSeat = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const playingPlayers = yield __1.default.getTablePlayers(this.iBattleId);
            let participant;
            if (this.bTurnClockwise) {
                participant = playingPlayers.find((p) => p.nSeat > previousSeat && p.eState === 'playing');
                if (!participant)
                    participant = this.aPlayer.find((p) => p.toJSON().nSeat >= 0 && p.toJSON().eState === 'playing');
            }
            else {
                participant = playingPlayers.find((p) => p.toJSON().nSeat < previousSeat && p.toJSON().eState === 'playing');
                ;
                if (!participant)
                    participant = this.aPlayer.find((p) => p.toJSON().nSeat <= playingPlayers.length && p.toJSON().eState === 'playing');
            }
            return yield this.getPlayer(participant.iPlayerId);
        });
    }
}
exports.default = Table;
