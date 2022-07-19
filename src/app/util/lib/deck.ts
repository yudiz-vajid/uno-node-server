/* eslint-disable no-plusplus */
import { ICard } from '../../../types/global';

class Deck {
  private aDeck: Array<ICard>;

  private aScore: Array<number>;

  constructor(aScores?: Array<number>) {
    if (aScores && !Array.isArray(aScores)) throw new Error('aScores must be an array');
    if (aScores && aScores.length !== 15) throw new Error('aScores must be 15 length');
    if (aScores && aScores.every(n => typeof n !== 'number')) throw new Error('aScores must be an array of numbers');
    this.aDeck = [];
    this.aScore = aScores ?? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 20, 20, 50, 50]; // - [0-9] -> face value, 10(skip) -> 20 , 11(reverse) -> 20, 12(drawTwo) -> 20, 13(wild)-> 50, 14(wildDrawFour) -> 50
    this.generateDeck();
  }

  private generateRedCards() {
    const aRedCard: Array<ICard> = [];
    aRedCard.push({ iCardId: `rd0`, eColor: 'red', nLabel: 0, nScore: this.aScore[0] });
    for (let i: ICard['nLabel'] = 1; i <= 12; i++) {
      aRedCard.push({ iCardId: `rd${i}a`, eColor: 'red', nLabel: i as ICard['nLabel'], nScore: this.aScore[i] });
      aRedCard.push({ iCardId: `rd${i}b`, eColor: 'red', nLabel: i as ICard['nLabel'], nScore: this.aScore[i] });
    } // - x1(0) + x18(1-9) + x2(10) + x2(11) + x2(12)
    return aRedCard; // - x25 => 19 -> numbered, 2 -> skip, 2-> reverse, 2-> drawTwo
  }

  private generateGreenCards() {
    const aGreenCard: Array<ICard> = [];
    aGreenCard.push({ iCardId: `gn0`, eColor: 'green', nLabel: 0, nScore: this.aScore[0] });
    for (let i: ICard['nLabel'] = 1; i <= 12; i++) {
      aGreenCard.push({ iCardId: `gn${i}a`, eColor: 'green', nLabel: i as ICard['nLabel'], nScore: this.aScore[i] });
      aGreenCard.push({ iCardId: `gn${i}b`, eColor: 'green', nLabel: i as ICard['nLabel'], nScore: this.aScore[i] });
    } // - x1(0) + x18(1-9) + x2(10) + x2(11) + x2(12)
    return aGreenCard; // - x25 => 19 -> numbered, 2 -> skip, 2-> reverse, 2-> drawTwo
  }

  private generateYellowCards() {
    const aYellowCard: Array<ICard> = [];
    aYellowCard.push({ iCardId: `yw0`, eColor: 'yellow', nLabel: 0, nScore: this.aScore[0] });
    for (let i: ICard['nLabel'] = 1; i <= 12; i++) {
      aYellowCard.push({ iCardId: `yw${i}a`, eColor: 'yellow', nLabel: i as ICard['nLabel'], nScore: this.aScore[i] });
      aYellowCard.push({ iCardId: `yw${i}b`, eColor: 'yellow', nLabel: i as ICard['nLabel'], nScore: this.aScore[i] });
    } // - x1(0) + x18(1-9) + x2(10) + x2(11) + x2(12)
    return aYellowCard; // - x25 => 19 -> numbered, 2 -> skip, 2-> reverse, 2-> drawTwo
  }

  private generateBlueCards() {
    const aBlueCard: Array<ICard> = [];
    aBlueCard.push({ iCardId: `be0`, eColor: 'blue', nLabel: 0, nScore: this.aScore[0] });
    for (let i: ICard['nLabel'] = 1; i <= 12; i++) {
      aBlueCard.push({ iCardId: `be${i}a`, eColor: 'blue', nLabel: i as ICard['nLabel'], nScore: this.aScore[i] });
      aBlueCard.push({ iCardId: `be${i}b`, eColor: 'blue', nLabel: i as ICard['nLabel'], nScore: this.aScore[i] });
    } // - x1(0) + x18(1-9) + x2(10) + x2(11) + x2(12)
    return aBlueCard; // - x25 => 19 -> numbered, 2 -> skip, 2-> reverse, 2-> drawTwo
  }

  private generateBlackCards() {
    const aWildCard: Array<ICard> = [];
    for (let i: ICard['nLabel'] = 13; i <= 14; i++) {
      for (let j = 0; j < 2; j++) {
        if (i === 13) aWildCard.push({ iCardId: `wd${i}${String.fromCharCode(97 + j)}`, eColor: 'black', nLabel: i as ICard['nLabel'], nScore: this.aScore[i] }); // - x4
        else aWildCard.push({ iCardId: `wr${i}${String.fromCharCode(97 + j)}`, eColor: 'black', nLabel: i as ICard['nLabel'], nScore: this.aScore[i] }); // - x4
      } // - x4
    }
    return aWildCard; // - x8 => 4 -> wild, 4 -> wildDrawFour
  }

  private generateDeck() {
    this.aDeck = [...this.generateRedCards(), ...this.generateGreenCards(), ...this.generateYellowCards(), ...this.generateBlueCards(), ...this.generateBlackCards()]; // - x108
    _.randomizeArray(this.aDeck); // - x108
  }

  public getDeck() {
    return this.aDeck;
  }
}

export default Deck;
