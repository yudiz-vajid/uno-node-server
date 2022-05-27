import { Card } from '../../../types/global';

class Deck {
  public static aDeck: Card[];

  static init() {
    Deck.aDeck = [...Deck.redCards, ...Deck.greenCards, ...Deck.blueCards, ...Deck.yellowCards];
  }

  static get redCards(): Card[] {
    const aRed: Card[] = [
      { nLabel: 1, eColor: 'r', nScore: 5, _id: 'r1a' },
      { nLabel: 1, eColor: 'r', nScore: 5, _id: 'r1b' },
      { nLabel: 2, eColor: 'r', nScore: 5, _id: 'r2a' },
      { nLabel: 2, eColor: 'r', nScore: 5, _id: 'r2b' },
      { nLabel: 3, eColor: 'r', nScore: 5, _id: 'r3a' },
      { nLabel: 3, eColor: 'r', nScore: 5, _id: 'r3b' },
      { nLabel: 4, eColor: 'r', nScore: 5, _id: 'r4a' },
      { nLabel: 4, eColor: 'r', nScore: 5, _id: 'r4b' },
      { nLabel: 5, eColor: 'r', nScore: 5, _id: 'r5a' },
      { nLabel: 5, eColor: 'r', nScore: 5, _id: 'r5b' },
      { nLabel: 6, eColor: 'r', nScore: 5, _id: 'r6a' },
      { nLabel: 6, eColor: 'r', nScore: 5, _id: 'r6b' },
      { nLabel: 7, eColor: 'r', nScore: 5, _id: 'r7a' },
      { nLabel: 7, eColor: 'r', nScore: 5, _id: 'r7b' },
      { nLabel: 8, eColor: 'r', nScore: 5, _id: 'r8a' },
      { nLabel: 8, eColor: 'r', nScore: 5, _id: 'r8b' },
      { nLabel: 9, eColor: 'r', nScore: 5, _id: 'r9a' },
      { nLabel: 9, eColor: 'r', nScore: 5, _id: 'r9b' },
      { nLabel: 10, eColor: 'r', nScore: 10, _id: 'r10a' },
      { nLabel: 10, eColor: 'r', nScore: 10, _id: 'r10b' },
      { nLabel: 11, eColor: 'r', nScore: 10, _id: 'r11a' },
      { nLabel: 11, eColor: 'r', nScore: 10, _id: 'r11b' },
      { nLabel: 12, eColor: 'r', nScore: 10, _id: 'r12a' },
      { nLabel: 12, eColor: 'r', nScore: 10, _id: 'r12b' },
      { nLabel: 13, eColor: 'w', nScore: 25, _id: 'w13a' },
      { nLabel: 13, eColor: 'w', nScore: 25, _id: 'w13b' },
      { nLabel: 14, eColor: 's', nScore: 15, _id: 's14a' },
    ];
    return aRed;
  }

  static get greenCards(): Card[] {
    const aGreen: Card[] = [
      { nLabel: 1, eColor: 'g', nScore: 5, _id: 'g1b' },
      { nLabel: 1, eColor: 'g', nScore: 5, _id: 'g1a' },
      { nLabel: 2, eColor: 'g', nScore: 5, _id: 'g2a' },
      { nLabel: 2, eColor: 'g', nScore: 5, _id: 'g2b' },
      { nLabel: 3, eColor: 'g', nScore: 5, _id: 'g3a' },
      { nLabel: 3, eColor: 'g', nScore: 5, _id: 'g3b' },
      { nLabel: 4, eColor: 'g', nScore: 5, _id: 'g4a' },
      { nLabel: 4, eColor: 'g', nScore: 5, _id: 'g4b' },
      { nLabel: 5, eColor: 'g', nScore: 5, _id: 'g5a' },
      { nLabel: 5, eColor: 'g', nScore: 5, _id: 'g5b' },
      { nLabel: 6, eColor: 'g', nScore: 5, _id: 'g6a' },
      { nLabel: 6, eColor: 'g', nScore: 5, _id: 'g6b' },
      { nLabel: 7, eColor: 'g', nScore: 5, _id: 'g7a' },
      { nLabel: 7, eColor: 'g', nScore: 5, _id: 'g7b' },
      { nLabel: 8, eColor: 'g', nScore: 5, _id: 'g8a' },
      { nLabel: 8, eColor: 'g', nScore: 5, _id: 'g8b' },
      { nLabel: 9, eColor: 'g', nScore: 5, _id: 'g9a' },
      { nLabel: 9, eColor: 'g', nScore: 5, _id: 'g9b' },
      { nLabel: 10, eColor: 'g', nScore: 10, _id: 'g10a' },
      { nLabel: 10, eColor: 'g', nScore: 10, _id: 'g10b' },
      { nLabel: 11, eColor: 'g', nScore: 10, _id: 'g11a' },
      { nLabel: 11, eColor: 'g', nScore: 10, _id: 'g11b' },
      { nLabel: 12, eColor: 'g', nScore: 10, _id: 'g12a' },
      { nLabel: 12, eColor: 'g', nScore: 10, _id: 'g12b' },
      { nLabel: 13, eColor: 'w', nScore: 25, _id: 'w13c' },
      { nLabel: 13, eColor: 'w', nScore: 25, _id: 'w13d' },
      { nLabel: 14, eColor: 's', nScore: 15, _id: 's14b' },
    ];
    return aGreen;
  }

  static get blueCards(): Card[] {
    const aBlue: Card[] = [
      { nLabel: 1, eColor: 'b', nScore: 5, _id: 'b1a' },
      { nLabel: 1, eColor: 'b', nScore: 5, _id: 'b1b' },
      { nLabel: 2, eColor: 'b', nScore: 5, _id: 'b2a' },
      { nLabel: 2, eColor: 'b', nScore: 5, _id: 'b2b' },
      { nLabel: 3, eColor: 'b', nScore: 5, _id: 'b3a' },
      { nLabel: 3, eColor: 'b', nScore: 5, _id: 'b3b' },
      { nLabel: 4, eColor: 'b', nScore: 5, _id: 'b4a' },
      { nLabel: 4, eColor: 'b', nScore: 5, _id: 'b4b' },
      { nLabel: 5, eColor: 'b', nScore: 5, _id: 'b5a' },
      { nLabel: 5, eColor: 'b', nScore: 5, _id: 'b5b' },
      { nLabel: 6, eColor: 'b', nScore: 5, _id: 'b6a' },
      { nLabel: 6, eColor: 'b', nScore: 5, _id: 'b6b' },
      { nLabel: 7, eColor: 'b', nScore: 5, _id: 'b7a' },
      { nLabel: 7, eColor: 'b', nScore: 5, _id: 'b7b' },
      { nLabel: 8, eColor: 'b', nScore: 5, _id: 'b8a' },
      { nLabel: 8, eColor: 'b', nScore: 5, _id: 'b8b' },
      { nLabel: 9, eColor: 'b', nScore: 5, _id: 'b9a' },
      { nLabel: 9, eColor: 'b', nScore: 5, _id: 'b9b' },
      { nLabel: 10, eColor: 'b', nScore: 10, _id: 'b10a' },
      { nLabel: 10, eColor: 'b', nScore: 10, _id: 'b10b' },
      { nLabel: 11, eColor: 'b', nScore: 10, _id: 'b11a' },
      { nLabel: 11, eColor: 'b', nScore: 10, _id: 'b11b' },
      { nLabel: 12, eColor: 'b', nScore: 10, _id: 'b12a' },
      { nLabel: 12, eColor: 'b', nScore: 10, _id: 'b12b' },
      { nLabel: 13, eColor: 'w', nScore: 25, _id: 'w13e' },
      { nLabel: 13, eColor: 'w', nScore: 25, _id: 'w13f' },
      { nLabel: 14, eColor: 's', nScore: 15, _id: 's14c' },
    ];
    return aBlue;
  }

  static get yellowCards(): Card[] {
    const aOrange: Card[] = [
      { nLabel: 1, eColor: 'y', nScore: 5, _id: 'y1a' },
      { nLabel: 1, eColor: 'y', nScore: 5, _id: 'y1b' },
      { nLabel: 2, eColor: 'y', nScore: 5, _id: 'y2a' },
      { nLabel: 2, eColor: 'y', nScore: 5, _id: 'y2b' },
      { nLabel: 3, eColor: 'y', nScore: 5, _id: 'y3a' },
      { nLabel: 3, eColor: 'y', nScore: 5, _id: 'y3b' },
      { nLabel: 4, eColor: 'y', nScore: 5, _id: 'y4a' },
      { nLabel: 4, eColor: 'y', nScore: 5, _id: 'y4b' },
      { nLabel: 5, eColor: 'y', nScore: 5, _id: 'y5a' },
      { nLabel: 5, eColor: 'y', nScore: 5, _id: 'y5b' },
      { nLabel: 6, eColor: 'y', nScore: 5, _id: 'y6a' },
      { nLabel: 6, eColor: 'y', nScore: 5, _id: 'y6b' },
      { nLabel: 7, eColor: 'y', nScore: 5, _id: 'y7a' },
      { nLabel: 7, eColor: 'y', nScore: 5, _id: 'y7b' },
      { nLabel: 8, eColor: 'y', nScore: 5, _id: 'y8a' },
      { nLabel: 8, eColor: 'y', nScore: 5, _id: 'y8b' },
      { nLabel: 9, eColor: 'y', nScore: 5, _id: 'y9a' },
      { nLabel: 9, eColor: 'y', nScore: 5, _id: 'y9b' },
      { nLabel: 10, eColor: 'y', nScore: 10, _id: 'y10a' },
      { nLabel: 10, eColor: 'y', nScore: 10, _id: 'y10b' },
      { nLabel: 11, eColor: 'y', nScore: 10, _id: 'y11a' },
      { nLabel: 11, eColor: 'y', nScore: 10, _id: 'y11b' },
      { nLabel: 12, eColor: 'y', nScore: 10, _id: 'y12a' },
      { nLabel: 12, eColor: 'y', nScore: 10, _id: 'y12b' },
      { nLabel: 13, eColor: 'w', nScore: 25, _id: 'w13g' },
      { nLabel: 13, eColor: 'w', nScore: 25, _id: 'w13h' },
      { nLabel: 14, eColor: 's', nScore: 15, _id: 's14d' },
    ];
    return aOrange;
  }

  public static getShuffledDeck(aCards?: Card[]): Card[] {
    if (aCards?.length) {
      const aRemainingCards = _.randomizeArray(aCards.splice(0, aCards.length - 1));
      aRemainingCards.push(aCards[aCards.length - 1]);
      return aRemainingCards;
    }
    Deck.init();
    const aShuffledCard = _.randomizeArray(Deck.aDeck);
    // const aShuffledCard = _.randomizeArray(PhaseTenDeck.aDeck).splice(0, 33);
    return aShuffledCard;
  }
}

export default Deck;
