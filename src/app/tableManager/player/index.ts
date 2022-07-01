/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import Service from './service';
import type Table from '../table';
import { response } from '../../util';
import { ICallback, ICard } from '../../../types/global';

class Player extends Service {
  /**
   * Fetch card from hand and based on iCardId, if not found fetch last card from hand.
   *
   * Remove fetched card from hand(Player) and add to discard pile(Table).
   *
   * get ttl of graceTimer
   *
   * if ttl is present then delete graceTimer from schedular, and update graceTimer(Player) with ttl
   *
   * if ttl is not present i,e turnTimer is active,delete turnTimer from schedular, and update graceTimer(Player) with 0
   *
   * send acknowledgement to client with success
   *
   * emit event 'resDiscardPile' to Table with discarded card as payload.
   *
   * pass turn to next player.
   */
  public async discardCard(oData: { iCardId: string; eColor?: Omit<ICard['eColor'], 'black'> }, oTable: Table, callback: ICallback) {
    log.verbose(`event: discardCard, player: ${this.iPlayerId}, iCardId: ${oData.iCardId}`);

    let nCardToDiscardIndex = this.aHand.findIndex(card => card.iCardId === oData.iCardId); // - return index if found else -1

    if (nCardToDiscardIndex === -1) {
      callback({ oData: {}, status: response.CARD_NOT_IN_HAND });
      return (log.silly(`no card found for iCardId: ${oData.iCardId}`) && null) ?? false;
    }
    if (!this.aHand.length) {
      callback({ oData: {}, status: response.EMPTY_HAND });
      return (log.silly(`no cards in hand `) && null) ?? false;
    }
    if(this.aHand.length===2&&!this.bUnoDeclared) await this.assignUnoMissPenalty(oTable)
    nCardToDiscardIndex = this.aHand.findIndex(card => card.iCardId === oData.iCardId); // - new index
    const [oCardToDiscard] = this.aHand.splice(nCardToDiscardIndex, 1); // - remove specified card from hand when not found remove last card from hand
    if (!oCardToDiscard) {
      callback({ oData: {}, status: response.SERVER_ERROR });
      return (log.error(`no card found for iCardId: ${oData.iCardId}`) && null) ?? false;
    }
    // TODO :- Need to manage action cards here like skip,reverse
    callback({ oData: {nHandScore:await this.handCardCounts(this.aHand)}, status: response.SUCCESS });
    const aPromises = [];

    // TODO : handle stacking for card.nLabel 12 (+2 card)
    let iSkipPlayer
    let bIsReverseCard=false
    if (oCardToDiscard.nLabel < 13) {
      if(oCardToDiscard.nLabel===10)iSkipPlayer=await this.assignSkipCard(oTable)
      if(oCardToDiscard.nLabel===11){
        oTable.toJSON().bTurnClockwise=!(oTable.toJSON().bTurnClockwise)
        oTable.toJSON().bIsReverseNow=true
        bIsReverseCard=await oTable.handleReverseCard()
      }
      if(oCardToDiscard.nLabel===12){
        // Find next player for stacking
        const iNextPlayerId=await oTable.getNextPlayer(this.nSeat)
        aPromises.push(oTable.update({ iDrawPenltyPlayerId: iNextPlayerId?.iPlayerId}));
      }
      aPromises.push(oTable.update({ eNextCardColor: oCardToDiscard.eColor, nDrawCount: oCardToDiscard.nLabel < 12 ? 1 :  (2 + (oTable.toJSON().nDrawCount===1?0:oTable.toJSON().nDrawCount)) }));
    }
    else {
      // TODO : handle stacking for card.nLabel 14 (wild draw 4 card)
      const iNextPlayerId=await oTable.getNextPlayer(this.nSeat)
      // aPromises.push(oTable.update({  nDrawCount: oCardToDiscard.nLabel === 13 ? 1 : 4,iDrawPenltyPlayerId: iNextPlayerId?.iPlayerId }));
      aPromises.push(oTable.update({  nDrawCount: oCardToDiscard.nLabel === 13 ? 1 : (4 + (oTable.toJSON().nDrawCount===1?0:oTable.toJSON().nDrawCount)),iDrawPenltyPlayerId: iNextPlayerId?.iPlayerId }));
    }

    
    aPromises.push(oTable.addToDiscardPile(oCardToDiscard));
    
    const nRemainingGraceTime = await oTable.getTTL('assignGraceTimerExpired', this.iPlayerId); // - in ms
    if (nRemainingGraceTime) {
      // - graceTimer is running so turnTime must be expired
      this.nGraceTime = nRemainingGraceTime;
      aPromises.push(oTable.deleteScheduler(`assignGraceTimerExpired`, this.iPlayerId));
    } else {
      // - graceTimer is not running so turnTime must be remaining.
      aPromises.push(oTable.deleteScheduler(`assignTurnTimerExpired`, this.iPlayerId));
    }
    
    /* used when user discard his card in grace time. */
    aPromises.push(this.update({ aHand: this.aHand, nGraceTime: this.nGraceTime }));
    await Promise.all(aPromises);
    
    if(this.aHand.length===1 && this.bUnoDeclared)oTable.emit('resUnoDeclare', { iPlayerId: this.iPlayerId});
    oTable.emit('resDiscardPile', { iPlayerId: this.iPlayerId, oCard: oCardToDiscard,nHandCardCount:this.aHand.length,nStackedCards:oTable.toJSON().nDrawCount });
    if(iSkipPlayer)oTable.emit('resUserSkip', { iPlayerId: iSkipPlayer});
    if(bIsReverseCard)oTable.emit('resReverseTurn', { bTurnClockwise: oTable.toJSON().bTurnClockwise});
    // oTable.emit('resNextCardDetail', { eColor: oTable.toJSON().eNextCardColor, nDrawCount: oTable.toJSON().nDrawCount }); // can be embedded in resDiscardPile event.

    if(oCardToDiscard.nLabel>12){
      this.wildCardColorTimer(oTable)
    }else{
      this.passTurn(oTable);
    }
    return true;

    // TODO : handle multiple clicks
  }

  /**
   * verify if player bSpecialMeterFull is true or false
   *
   * if true then draw a card from special pile and add to hand.
   *
   * if false then draw a card from normal pile and add to hand.
   *
   * update Table { drawPile }
   *
   * update Player { nDrawNormal, bSpecialMeterFull, aHand }
   *
   * send acknowledgement to client with success, and drawnCard details
   *
   * emit event 'resDrawCard' to Table with { iPlayerId, nCardCount } as payload.
   */
  public async drawCard(oData: Record<string, never>, oTable: Table, callback: ICallback) {
    log.verbose(`${_.now()} event: drawCard, player: ${this.iPlayerId}`);
    const aCard = this.bSpecialMeterFull ? oTable.drawCard('special', 1) : oTable.drawCard('normal', 1);
    if (!aCard) {
      callback({ oData: {}, status: response.SERVER_ERROR });
      return (log.error(`${_.now()} no card found for iCardId: ${oData.iCardId}`) && null) ?? false;
    }
    

    // - setting up special meter from nDrawNormal
    const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
    this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
    this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;

    log.verbose(`${_.now()} player: ${this.iPlayerId}, drawnCard: ${aCard[0].iCardId}`);
    // check if it is playable or not
    let isPlayableCard=await this.checkPlayableCard(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor,aCard[0])
    // callback({ oData:{oCard: aCard[0],nDrawNormal:this.nDrawNormal,nSpecialMeterFillCount,bIsPlayable:isPlayableCard,nHandScore:await this.handCardCounts()}, status: response.SUCCESS });
    callback({ oData:{}, status: response.SUCCESS });
    
    this.emit('resDrawCard', { iPlayerId: this.iPlayerId,aCard:[aCard[0]], nDrawNormal:this.nDrawNormal,nSpecialMeterFillCount,bIsPlayable:isPlayableCard,nHandScore:await this.handCardCounts() ,eReason:'normalDraw' });
    oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId,aCard:[], nCardCount: 1,nHandCardCount:this.aHand.length+1,eReason:'normalDraw' },[this.iPlayerId]);
    
    await Promise.all([
      oTable.updateDrawPile(),
      this.update({ nDrawNormal: this.nDrawNormal, bSpecialMeterFull: this.bSpecialMeterFull, aHand: [...this.aHand, ...aCard] }),
      //
    ]);
    
    if(!isPlayableCard){
      let aPromises=[]
      const nRemainingGraceTime = await oTable.getTTL('assignGraceTimerExpired', this.iPlayerId); // - in ms
      if (nRemainingGraceTime) {
        // - graceTimer is running so turnTime must be expired
        this.nGraceTime = nRemainingGraceTime;
        aPromises.push(oTable.deleteScheduler(`assignGraceTimerExpired`, this.iPlayerId));
      } else {
        // - graceTimer is not running so turnTime must be remaining.
        // this.nGraceTime = 0;
        aPromises.push(oTable.deleteScheduler(`assignTurnTimerExpired`, this.iPlayerId));
      }
      await Promise.all([
        ...aPromises,
        this.update({nGraceTime: this.nGraceTime }),
      ]);
      this.passTurn(oTable)

    }
    // return true;

    // TODO : reqKeepPlay for playable drawnCard
    // TODO : pass turn
    // TODO : handle multiple clicks
  }

  public async keepCard(oData: Record<string, never>, oTable: Table, callback: ICallback) {
    log.verbose(`${_.now()} event: keepCard, player: ${this.iPlayerId}`);
    const aPromises = [];

    const nRemainingGraceTime = await oTable.getTTL('assignGraceTimerExpired', this.iPlayerId); // - in ms
    if (nRemainingGraceTime) {
      // - graceTimer is running so turnTime must be expired
      this.nGraceTime = nRemainingGraceTime;
      aPromises.push(oTable.deleteScheduler(`assignGraceTimerExpired`, this.iPlayerId));
    } else {
      // - graceTimer is not running so turnTime must be remaining.
      // this.nGraceTime = 0;
      aPromises.push(oTable.deleteScheduler(`assignTurnTimerExpired`, this.iPlayerId));
    }

    /* used when user discard his card in grace time. */
    aPromises.push(this.update({nGraceTime: this.nGraceTime }));
    await Promise.all(aPromises);
    this.passTurn(oTable)
    callback({ oData:{}, status: response.SUCCESS });
    return true;
  }

  public async setWildCardColor(oData: any, oTable: Table, callback: ICallback) {
    console.log('setWildCardColor called.... ',oData);
    log.verbose(`${_.now()} event: setWildCardColor, player: ${this.iPlayerId}`);
    const aPromises = [];

    const nRemainingTime = await oTable.getTTL('assignWildCardColorTimerExpired', this.iPlayerId); // - in ms
    if (!nRemainingTime)
    {
      callback({ oData:{}, status: response.SUCCESS });
    } else {
      aPromises.push(oTable.deleteScheduler(`assignWildCardColorTimerExpired`, this.iPlayerId));
    }

    let updatedDiscardPile=[...oTable.toJSON().aDiscardPile]
    updatedDiscardPile[updatedDiscardPile.length-1].eColor=oData.eColor
    oTable.emit('resWildCardColor', { iPlayerId: this.iPlayerId,eColor:oData.eColor});
    /* used when user discard his card in grace time. */
    aPromises.push(oTable.update({eNextCardColor:oData.eColor,aDiscardPile: updatedDiscardPile }));
    await Promise.all(aPromises);
    this.passTurn(oTable)
    return true;
  }

  public async decalreUno(oData: any, oTable: Table, callback: ICallback) {
    log.verbose(`${_.now()} event: decalreUno, player: ${this.iPlayerId}`);
    const eligibleUno=this.aHand.length===2
    let playableCards= await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor)
    if(!eligibleUno && playableCards.length){
      callback({ oData: {}, status: response.WRONG_UNO });
      return (log.silly(`${_.now()} ${this.iPlayerId} has not valid uno.`) && null) ?? false;
    }else{
      await this.update({'bUnoDeclared':true})
      callback({ oData: {}, status: response.SUCCESS });
      // oTable.emit('resUnoDeclare', { iPlayerId: this.iPlayerId},[this.iPlayerId]);
    }
  }

}

export default Player;
