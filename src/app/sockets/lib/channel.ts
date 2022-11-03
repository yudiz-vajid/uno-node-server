/* eslint-disable no-param-reassign */
import { ICallback } from '../../../types/global';

class Channel {
  private iBattleId: string;

  private iPlayerId: string;

  constructor(iBattleId: string, iPlayerId: string) {
    this.iBattleId = iBattleId;
    this.iPlayerId = iPlayerId;
  }

  // { sTaskName: 'reqDiscardCard' | 'reqDrawCard'; oData: Record<string, unknown> }
  public async onEvent(body: any, ack: ICallback) {
    if (process.env.NODE_ENV === 'dev' && typeof body === 'object') body = _.stringify(body); // For postman use
    const parseBody: {
      sTaskName: 'reqDiscardCard' | 'reqDrawCard' | 'reqKeepCard' | 'reqSetWildCardColor' | 'reqUno' | 'reqCurrentCardColor' | 'reqLeave';
      oData: Record<string, unknown>;
    } = JSON.parse(body);
    try {
      if (typeof ack !== 'function') return false;
      const { sTaskName, oData } = parseBody;
      switch (sTaskName) {
        case 'reqDrawCard':
          emitter.emit('channelEvent', { sTaskName: 'drawCard', iBattleId: this.iBattleId, iPlayerId: this.iPlayerId ?? '', oData }, ack);
          break;

        case 'reqDiscardCard':
          emitter.emit('channelEvent', { sTaskName: 'discardCard', iBattleId: this.iBattleId, iPlayerId: this.iPlayerId ?? '', oData }, ack);
          break;

        case 'reqKeepCard':
          emitter.emit('channelEvent', { sTaskName: 'keepCard', iBattleId: this.iBattleId, iPlayerId: this.iPlayerId ?? '', oData }, ack);
          break;

        case 'reqSetWildCardColor':
          emitter.emit('channelEvent', { sTaskName: 'setWildCardColor', iBattleId: this.iBattleId, iPlayerId: this.iPlayerId ?? '', oData }, ack);
          break;

        case 'reqUno':
          emitter.emit('channelEvent', { sTaskName: 'declareUno', iBattleId: this.iBattleId, iPlayerId: this.iPlayerId ?? '', oData }, ack);
          break;

        case 'reqLeave':
          emitter.emit('channelEvent', { sTaskName: 'leaveMatch', iBattleId: this.iBattleId, iPlayerId: this.iPlayerId ?? '', oData }, ack);
          break;

        case 'reqCurrentCardColor':
          emitter.emit('channelEvent', { sTaskName: 'currentCardColor', iBattleId: this.iBattleId, iPlayerId: this.iPlayerId ?? '', oData }, ack);
          break;

        default:
          return false;
      }
      return true;
    } catch (err: any) {
      log.error(_.now(), `channel.onEvent ${parseBody.sTaskName} failed!!! reason: ${err.message}`);
      return false;
    }
  }
}

export default Channel;
