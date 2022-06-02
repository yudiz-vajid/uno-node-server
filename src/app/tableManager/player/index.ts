import type Table from '../table';
import Service from './service';

class Player extends Service {
  public async setHand(aNormalCard: Table['aDrawPile'], aActionCard: Table['aDrawPile'], aWildCard: Table['aDrawPile']) {
    log.verbose(`setHand called for user ${this.iPlayerId}`);

    this.aHand.push(...aNormalCard);
    this.aHand.push(...aActionCard);
    this.aHand.push(...aWildCard);

    await this.update({ aHand: this.aHand });
    this.emit('resHand', { aHand: this.aHand });
  }
}

export default Player;
