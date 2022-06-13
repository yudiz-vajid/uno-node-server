import { ICallback } from '../../../types/global';

class Channel {
  private iBattleId: string;

  private iPlayerId: string;

  constructor(iBattleId: string, iPlayerId: string) {
    this.iBattleId = iBattleId;
    this.iPlayerId = iPlayerId;
  }

  public async onEvent(body: { sTaskName: 'reqDiscardCard' | 'reqDrawCard'; oData: Record<string, unknown> }, ack: ICallback) {
    try {
      if (typeof ack !== 'function') return false;
      const { sTaskName, oData } = body;
      switch (sTaskName) {
        case 'reqDrawCard':
          emitter.emit('channelEvent', { sTaskName: 'drawCard', iBattleId: this.iBattleId, iPlayerId: this.iPlayerId ?? '', oData }, ack);
          break;

        case 'reqDiscardCard':
          emitter.emit('channelEvent', { sTaskName: 'discardCard', iBattleId: this.iBattleId, iPlayerId: this.iPlayerId ?? '', oData }, ack);
          break;

        default:
          return false;
      }
      return true;
    } catch (err: any) {
      log.error(_.now(), `channel.onEvent ${body.sTaskName} failed!!! reason: ${err.message}`);
      return false;
    }
  }
}

export default Channel;
