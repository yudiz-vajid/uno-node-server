/* eslint-disable class-methods-use-this */

import TableManager from "../../tableManager";

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

  async discardCard(oData: any, callback: (err:any,data: any) => unknown) {
    console.log('discardCard called....');
    const table:any = await TableManager.getTable(this.iBattleId);
    if (!table) this.logError(messages.not_found('table'), callback);
    if (table?.toJSON().eState !== 'running') return this.logError(messages.discard_card_error_table(table.toJSON().eState), callback);

    const participant =await TableManager.getPlayer(this.iBattleId,this.iPlayerId)
    if (!participant) return this.logError(messages.not_found('participant'), callback);
    if (!await participant.hasValidTurn())return this.logError(messages.custom.wait_for_turn, callback);
    participant.discardCard(oData, async (error) => {
        if (error) return this.logError(error, callback);
        callback( null , {oData:{status:'success'}});
    });
  }

  async drawCard(oData: any, callback: (data: any) => unknown) {
    console.log('drawCard called....');
    return callback(oData);
  }

  public logError = function (error:any, callback: (err:any,data: any) => unknown) {
    // eslint-disable-next-line no-console
    return callback(error,{});
};

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
