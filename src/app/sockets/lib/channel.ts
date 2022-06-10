/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
class Channel {
  private iBattleId: string;

  private iPlayerId: string;

  constructor(iBattleId: string, iPlayerId: string) {
    this.iBattleId = iBattleId;
    this.iPlayerId = iPlayerId;
  }

  async startGame(oData: any, callback: (data: any) => unknown) {
    return callback(oData);
  }

  async discardCard(oData: any, callback: (data: any) => unknown) {
    console.log('discardCard called....');
    return callback(oData);
  }

  async drawCard(oData: any, callback: (data: any) => unknown) {
    console.log('drawCard called....');
    return callback(oData);
  }

  public async onEvent(body: { sTaskName: 'startGame'|'reqDiscardCard'|'reqDrawCard'; [key: string]: any }, _ack: (data: any) => unknown) {
    try {
      if (typeof _ack !== 'function') return false;
      const { sTaskName, ...oData } = body;
      switch (sTaskName) {
        case 'startGame':
          return this.startGame(oData, _ack);
        case 'reqDiscardCard':
          return this.discardCard(oData, _ack);
        case 'reqDrawCard':
          return this.drawCard(oData, _ack);
        default:
          return false;
      }
    } catch (err: any) {
      log.error(_.now(), `channel.onEvent ${body.sTaskName} failed!!! reason: ${err.message}`);
      return false;
    }
  }
}

export default Channel;
