"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Deck {
    constructor(aScores) {
        if (aScores && !Array.isArray(aScores))
            throw new Error('aScores must be an array');
        if (aScores && aScores.length !== 15)
            throw new Error('aScores must be 15 length');
        if (aScores && aScores.every(n => typeof n !== 'number'))
            throw new Error('aScores must be an array of numbers');
        this.aDeck = [];
        this.aScore = aScores !== null && aScores !== void 0 ? aScores : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 20, 20, 50, 50];
        this.generateDeck();
    }
    generateRedCards() {
        const aRedCard = [];
        aRedCard.push({ iCardId: `rd0`, eColor: 'red', nLabel: 0, nScore: this.aScore[0] });
        for (let i = 1; i <= 12; i++) {
            aRedCard.push({ iCardId: `rd${i}a`, eColor: 'red', nLabel: i, nScore: this.aScore[i] });
            aRedCard.push({ iCardId: `rd${i}b`, eColor: 'red', nLabel: i, nScore: this.aScore[i] });
        }
        return aRedCard;
    }
    generateGreenCards() {
        const aGreenCard = [];
        aGreenCard.push({ iCardId: `gn0`, eColor: 'green', nLabel: 0, nScore: this.aScore[0] });
        for (let i = 1; i <= 12; i++) {
            aGreenCard.push({ iCardId: `gn${i}a`, eColor: 'green', nLabel: i, nScore: this.aScore[i] });
            aGreenCard.push({ iCardId: `gn${i}b`, eColor: 'green', nLabel: i, nScore: this.aScore[i] });
        }
        return aGreenCard;
    }
    generateYellowCards() {
        const aYellowCard = [];
        aYellowCard.push({ iCardId: `yw0`, eColor: 'yellow', nLabel: 0, nScore: this.aScore[0] });
        for (let i = 1; i <= 12; i++) {
            aYellowCard.push({ iCardId: `yw${i}a`, eColor: 'yellow', nLabel: i, nScore: this.aScore[i] });
            aYellowCard.push({ iCardId: `yw${i}b`, eColor: 'yellow', nLabel: i, nScore: this.aScore[i] });
        }
        return aYellowCard;
    }
    generateBlueCards() {
        const aBlueCard = [];
        aBlueCard.push({ iCardId: `be0`, eColor: 'blue', nLabel: 0, nScore: this.aScore[0] });
        for (let i = 1; i <= 12; i++) {
            aBlueCard.push({ iCardId: `be${i}a`, eColor: 'blue', nLabel: i, nScore: this.aScore[i] });
            aBlueCard.push({ iCardId: `be${i}b`, eColor: 'blue', nLabel: i, nScore: this.aScore[i] });
        }
        return aBlueCard;
    }
    generateBlackCards() {
        const aWildCard = [];
        for (let i = 13; i <= 14; i++) {
            for (let j = 0; j < 2; j++) {
                if (i === 13)
                    aWildCard.push({ iCardId: `wd${i}${String.fromCharCode(97 + j)}`, eColor: 'black', nLabel: i, nScore: this.aScore[i] });
                else
                    aWildCard.push({ iCardId: `wr${i}${String.fromCharCode(97 + j)}`, eColor: 'black', nLabel: i, nScore: this.aScore[i] });
            }
        }
        return aWildCard;
    }
    generateDeck() {
        this.aDeck = [...this.generateRedCards(), ...this.generateGreenCards(), ...this.generateYellowCards(), ...this.generateBlueCards(), ...this.generateBlackCards()];
        _.randomizeArray(this.aDeck);
    }
    getDeck() {
        return this.aDeck;
    }
}
exports.default = Deck;
