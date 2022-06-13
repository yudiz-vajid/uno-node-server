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
class Table extends service_1.default {
    distributeCard() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let { nStartingNormalCardCount, nStartingActionCardCount, nStartingSpecialCardCount } = this.oSettings;
            nStartingActionCardCount = nStartingActionCardCount || _.getRandomNumber(2, 3);
            const nStartingWildCardCount = nStartingSpecialCardCount - nStartingActionCardCount;
            const nInitialCardsPerUser = nStartingNormalCardCount + nStartingSpecialCardCount;
            if (this.aDrawPile.length <= this.aPlayer.length * nInitialCardsPerUser)
                return (_a = (log.error(`Not enough cards in the draw pile to distribute to all players`) && null)) !== null && _a !== void 0 ? _a : false;
            this.aPlayer.forEach((player) => __awaiter(this, void 0, void 0, function* () {
                var _c, _d, _e;
                log.verbose(`length(drawPile): ${this.aDrawPile.length} `);
                const aNormalCard = this.drawCard('normal', nStartingNormalCardCount);
                if (!aNormalCard)
                    return (_c = (log.error(`Could not draw normal cards for player ${player.toJSON().iPlayerId}`) && null)) !== null && _c !== void 0 ? _c : false;
                const aActionCard = this.drawCard('action', nStartingActionCardCount);
                if (!aActionCard)
                    return (_d = (log.error(`Could not draw action cards for player ${player.toJSON().iPlayerId}`) && null)) !== null && _d !== void 0 ? _d : false;
                const aWildCard = this.drawCard('wild', nStartingWildCardCount);
                if (!aWildCard)
                    return (_e = (log.error(`Could not draw wild cards for player ${player.toJSON().iPlayerId}`) && null)) !== null && _e !== void 0 ? _e : false;
                yield player.setHand(aNormalCard, aActionCard, aWildCard);
                return true;
            }));
            const oDiscardPileTopCard = this.drawCard('normal', 1);
            if (!oDiscardPileTopCard)
                return (_b = (log.error(`Could not draw discard pile top card`) && null)) !== null && _b !== void 0 ? _b : false;
            this.aDiscardPile.push(...oDiscardPileTopCard);
            yield Promise.all([
                this.updateDrawPile(this.aDrawPile),
                this.updateDiscardPile(this.aDiscardPile),
                this.update({ eState: 'running' }),
            ]);
            yield _.delay(5000);
            this.emit('resDiscardPileTopCard', { oDiscardPileTopCard: this.getDiscardPileTopCard() });
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
    assignRandomTurn() {
        return __awaiter(this, void 0, void 0, function* () {
            const oRandomPlayer = _.randomizeArray(this.aPlayer)[0];
            oRandomPlayer.takeTurn(this);
        });
    }
    getDiscardPileTopCard() {
        return this.aDiscardPile[this.aDiscardPile.length - 1];
    }
    getNextPlayer(nPreviousSeat) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const aPlayingPlayer = this.aPlayer.filter(p => p.toJSON().eState === 'playing');
            if (!aPlayingPlayer.length)
                return (_a = (log.error(`No players have eState 'playing'`) && null)) !== null && _a !== void 0 ? _a : null;
            let oPlayer;
            if (this.bTurnClockwise) {
                aPlayingPlayer.sort((p1, p2) => p1.toJSON().nSeat - p2.toJSON().nSeat);
                oPlayer = aPlayingPlayer.find(p => p.toJSON().nSeat > nPreviousSeat);
                if (!oPlayer)
                    oPlayer = aPlayingPlayer.find(p => p.toJSON().nSeat < nPreviousSeat);
            }
            else {
                aPlayingPlayer.sort((p1, p2) => p2.toJSON().nSeat - p1.toJSON().nSeat);
                oPlayer = aPlayingPlayer.find(p => p.toJSON().nSeat < nPreviousSeat);
                if (!oPlayer)
                    oPlayer = aPlayingPlayer.find(p => p.toJSON().nSeat > nPreviousSeat);
            }
            if (!oPlayer)
                return (_b = (log.error(`No player found`) && null)) !== null && _b !== void 0 ? _b : null;
            return oPlayer;
        });
    }
    hasValidTurn(iPlayerId) {
        const oPlayer = this.aPlayer.find(p => p.toJSON().iPlayerId === iPlayerId);
        if (!oPlayer)
            return false;
        return this.iPlayerTurn === iPlayerId && oPlayer.toJSON().eState === 'playing';
    }
}
exports.default = Table;
