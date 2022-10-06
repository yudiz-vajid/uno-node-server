/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import Service from './service';
import type Table from '../table';
import { response } from '../../util';
import { ICallback, ICard, IPlayer } from '../../../types/global';

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
    log.debug(`${_.now()} event: discardCard, player: ${this.iPlayerId}, tableID: ${this.iBattleId}, iCardId: ${oData.iCardId}`);
    let nCardToDiscardIndex = this.aHand.findIndex(card => card.iCardId === oData.iCardId); // - return index if found else -1

    if (nCardToDiscardIndex === -1) {
      callback({ oData: {}, status: response.CARD_NOT_IN_HAND });
      return (log.silly(`no card found for iCardId: ${oData.iCardId}`) && null) ?? false;
    }
    if (!this.aHand.length) {
      callback({ oData: {}, status: response.EMPTY_HAND });
      return (log.silly(`no cards in hand `) && null) ?? false;
    }
    nCardToDiscardIndex = this.aHand.findIndex(card => card.iCardId === oData.iCardId); // - new index
    const [oCardToDiscard] = this.aHand.splice(nCardToDiscardIndex, 1); // - remove specified card from hand when not found remove last card from hand
    if (!oCardToDiscard) {
      callback({ oData: {}, status: response.SERVER_ERROR });
      return (log.error(`no card found for iCardId: ${oData.iCardId}`) && null) ?? false;
    }
    callback({ oData: { nHandScore: await this.handCardCounts(this.aHand) }, status: response.SUCCESS });
    const aPromises = [];

    let iSkipPlayer;
    let bIsReverseCard = false;
    let usedCard: Player['nUsedActionCard' | 'nUsedNormalCard' | 'nUsedSpecialCard'] | string;
    if (oCardToDiscard.nLabel < 13) {
      if (oCardToDiscard.nLabel < 10) usedCard = 'nUsedNormalCard';
      if (oCardToDiscard.nLabel === 10) {
        iSkipPlayer = await this.assignSkipCard(oTable);
        usedCard = 'nUsedActionCard';
        aPromises.push(this.update({ nSkipUsed: this.nSkipUsed + 1 }));
      }
      if (oCardToDiscard.nLabel === 11) {
        oTable.toJSON().bTurnClockwise = !oTable.toJSON().bTurnClockwise;
        oTable.toJSON().bIsReverseNow = true;
        bIsReverseCard = await oTable.handleReverseCard();
        usedCard = 'nUsedActionCard';
        aPromises.push(this.update({ nReverseUsed: this.nReverseUsed + 1 }));
      }
      if (oCardToDiscard.nLabel === 12) {
        // Find next player for stacking
        const iNextPlayerId = await oTable.getNextPlayer(this.nSeat);
        aPromises.push(oTable.update({ iDrawPenltyPlayerId: iNextPlayerId?.iPlayerId }));
        usedCard = 'nUsedActionCard';
        aPromises.push(this.update({ nDraw2Used: this.nDraw2Used + 1 }));
      }
      aPromises.push(
        oTable.update({
          eNextCardColor: oCardToDiscard.eColor,
          nDrawCount: oCardToDiscard.nLabel < 12 ? 1 : 2 + (oTable.toJSON().nDrawCount === 1 ? 0 : oTable.toJSON().nDrawCount),
        })
      );
    } else {
      const iNextPlayerId = await oTable.getNextPlayer(this.nSeat);
      usedCard = 'nUsedSpecialCard';
      if (oCardToDiscard.nLabel === 13) aPromises.push(this.update({ nWildUsed: this.nWildUsed + 1 }));
      else aPromises.push(this.update({ nDraw4Used: this.nDraw4Used + 1 }));
      // aPromises.push(oTable.update({  nDrawCount: oCardToDiscard.nLabel === 13 ? 1 : 4,iDrawPenltyPlayerId: iNextPlayerId?.iPlayerId }));
      aPromises.push(
        oTable.update({
          nDrawCount: oCardToDiscard.nLabel === 13 ? 1 : 4 + (oTable.toJSON().nDrawCount === 1 ? 0 : oTable.toJSON().nDrawCount),
          iDrawPenltyPlayerId: oCardToDiscard.nLabel === 13 ? '' : iNextPlayerId?.iPlayerId,
        })
      );
    }

    aPromises.push(oTable.update({ iPlayerTurn: '' }));
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
    let usedCardCount = this.nUsedNormalCard;
    if (usedCard === 'nUsedActionCard') usedCardCount = this.nUsedActionCard;
    else if (usedCard === 'nUsedSpecialCard') usedCardCount = this.nUsedSpecialCard;
    // add turn data here.
    const timeTaken = Math.abs(Math.round(new Date().getTime() - new Date(oTable.toJSON().dTurnAssignedAt).getTime()));
    log.verbose(timeTaken);
    oTable.toJSON().aTurnInfo.push({
      Uid: this.iPlayerId,
      Action: 'discardCard',
      CardPlayed: [oData.iCardId],
      Score: await this.handCardCounts(this.aHand),
      TimeTaken: timeTaken ? timeTaken / 1000 : 0,
      CardsRemaining: this.aHand.length,
      LastOne: !this.aHand.length,
    });
    aPromises.push(this.update({ aHand: this.aHand, nGraceTime: this.nGraceTime, [usedCard]: usedCardCount + 1 }));
    aPromises.push(oTable.update({ aTurnInfo: oTable.toJSON().aTurnInfo }));
    await Promise.all(aPromises);

    if (this.aHand.length === 1 && this.bUnoDeclared) oTable.emit('resUnoDeclare', { iPlayerId: this.iPlayerId });
    oTable.emit('resDiscardPile', { iPlayerId: this.iPlayerId, oCard: oCardToDiscard, nHandCardCount: this.aHand.length, nStackedCards: oTable.toJSON().nDrawCount });
    if (this.aHand.length === 1 && !this.bUnoDeclared) {
      await _.delay(600);
      await this.assignUnoMissPenalty(oTable);
    }
    if (this.aHand.length === 1 && this.bUnoDeclared) await _.delay(1000); // uno animation
    if (iSkipPlayer) {
      await _.delay(600);
      oTable.emit('resUserSkip', { iPlayerId: iSkipPlayer });
      await _.delay(2000);
    }
    if (bIsReverseCard) {
      await _.delay(600);
      oTable.emit('resReverseTurn', { bTurnClockwise: oTable.toJSON().bTurnClockwise });
      await _.delay(1500);
    }
    // oTable.emit('resNextCardDetail', { eColor: oTable.toJSON().eNextCardColor, nDrawCount: oTable.toJSON().nDrawCount }); // can be embedded in resDiscardPile event.

    if (oCardToDiscard.nLabel > 12) {
      if (oCardToDiscard.nLabel === 14) await _.delay(1000);
      this.wildCardColorTimer(oTable);
    } else {
      if (oCardToDiscard.nLabel === 12) await _.delay(1500);
      this.passTurn(oTable);
    }
    return true;
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
    log.debug(`${_.now()} event: drawCard, player: ${this.iPlayerId}, tableID: ${this.iBattleId}`);
    const aPromise: any = [];
    if (!oTable.toJSON().aDrawPile.length) await oTable.reshuffleClosedDeck();
    const alreadyHavePlayableCard = await this.getPlayableCardIds(await oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
    if (alreadyHavePlayableCard.length) aPromise.push(this.update({ nOptionalDraw: this.nOptionalDraw + 1 }));
    if (oTable.toJSON().iDrawPenltyPlayerId === this.iPlayerId) {
      callback({ oData: {}, status: response.SUCCESS });
      await this.assignDrawPenalty(oTable);

      if (oTable.toJSON().oSettings.bDisallowPlayOnDrawCardPenalty) {
        this.passTurn(oTable);
      } else {
        const aPlayableCardId = await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
        const remainingTurnTimer: any = await oTable.getTTL('assignTurnTimerExpired', this.iPlayerId);
        this.emit('resTurnTimer', {
          bIsGraceTimer: false,
          iPlayerId: this.iPlayerId,
          ttl: remainingTurnTimer - 500,
          timestamp: Date.now(),
          aPlayableCards: aPlayableCardId,
          bDrawPileEmpty: oTable.toJSON().aDrawPile.length === 0,
        });
        oTable.emit(
          'resTurnTimer',
          {
            bIsGraceTimer: false,
            iPlayerId: this.iPlayerId,
            ttl: remainingTurnTimer - 500,
            timestamp: Date.now(),
            aPlayableCards: [],
            bDrawPileEmpty: oTable.toJSON().aDrawPile.length === 0,
          },
          [this.iPlayerId]
        );
        // this.takeTurn(oTable) // No need to call take turn because player has already a valid turn at this stage.
      }
      return true;
    }
    const aCard: any = this.bSpecialMeterFull ? await oTable.drawCard('special', 1) : await oTable.drawCard('normal', 1);
    log.debug(` drawn card is --> ${aCard} `);
    if (!aCard || !aCard.length || aCard === undefined) {
      callback({ oData: {}, status: response.DECK_EMPTY });
      return (log.error(`${_.now()} no card found for iCardId: ${oData.iCardId}`) && null) ?? false;
    }
    // - setting up special meter from nDrawNormal
    const { nSpecialMeterFillCount } = oTable.toJSON().oSettings;
    if (!this.bSkipSpecialMeterProcess) {
      this.nDrawNormal = this.nDrawNormal === nSpecialMeterFillCount ? 0 : this.nDrawNormal + 1;
      this.bSpecialMeterFull = this.nDrawNormal === nSpecialMeterFillCount;
    }

    log.verbose(`${_.now()} player: ${this.iPlayerId}, drawnCard: ${aCard[0].iCardId}`);
    const isPlayableCard = await this.checkPlayableCard(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor, aCard[0]);
    callback({ oData: {}, status: response.SUCCESS });
    const drawnCardType = aCard[0].nLabel < 10 ? 'nDrawnNormalCard' : 'nDrawnSpecialCard';
    const drawnCardCount = aCard[0].nLabel < 10 ? this.nDrawnNormalCard : this.nDrawnSpecialCard;
    this.emit('resDrawCard', {
      iPlayerId: this.iPlayerId,
      aCard: [aCard[0]],
      nDrawNormal: this.nDrawNormal,
      nSpecialMeterFillCount,
      bIsPlayable: isPlayableCard,
      nHandScore: await this.handCardCounts([...this.aHand, ...aCard]),
      eReason: 'normalDraw',
    });
    const timeTaken = Math.abs(Math.round(new Date().getTime() - new Date(oTable.toJSON().dTurnAssignedAt).getTime()));
    oTable.toJSON().aTurnInfo.push({
      Uid: this.iPlayerId,
      Action: 'drawCard',
      CardPlayed: [aCard[0].iCardId],
      Score: await this.handCardCounts(),
      TimeTaken: timeTaken ? timeTaken / 1000 : 0,
      CardsRemaining: this.aHand.length,
      LastOne: false,
    });
    oTable.emit('resDrawCard', { iPlayerId: this.iPlayerId, aCard: [], nCardCount: 1, nHandCardCount: this.aHand.length + 1, eReason: 'normalDraw' }, [this.iPlayerId]);
    if (!isPlayableCard) await oTable.update({ iPlayerTurn: '' });
    await _.delay(300); // draw card animation
    this.aDrawnCards.push(aCard[0].iCardId); // Add card to users card list.
    await Promise.all([
      ...aPromise,
      oTable.updateDrawPile(),
      oTable.update({ aTurnInfo: oTable.toJSON().aTurnInfo }),
      this.update({
        bIsCardTaken: true,
        nDrawNormal: this.nDrawNormal,
        bSpecialMeterFull: this.bSpecialMeterFull,
        aHand: [...this.aHand, ...aCard],
        aDrawnCards: this.aDrawnCards,
        // aTurnData: this.aTurnData,
      }),
      //
    ]);

    if (!isPlayableCard) {
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
      await Promise.all([...aPromises, this.update({ nGraceTime: this.nGraceTime, bUnoDeclared: false }), oTable.update({ iDrawPenltyPlayerId: '' })]);
      this.passTurn(oTable);
    }
    return true;
  }

  public async keepCard(oData: Record<string, never>, oTable: Table, callback: ICallback) {
    log.debug(`${_.now()} event: drawCard, player: ${this.iPlayerId}, tableID: ${this.iBattleId}`);
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
    if (this.aHand.length <= 2 && this.aHand.length + 1 >= 2) {
      aPromises.push(this.update({ bUnoDeclared: false }));
      aPromises.push(oTable.update({ iDrawPenltyPlayerId: '' }));
    }
    aPromises.push(this.update({ nGraceTime: this.nGraceTime }));
    await Promise.all(aPromises);
    this.passTurn(oTable);
    callback({ oData: {}, status: response.SUCCESS });
    return true;
  }

  public async setWildCardColor(oData: any, oTable: Table, callback: ICallback) {
    log.debug(`${_.now()} event: setWildCardColor, player: ${this.iPlayerId}, tableID: ${this.iBattleId}`);
    const aPromises = [];

    const nRemainingTime = await oTable.getTTL('assignWildCardColorTimerExpired', this.iPlayerId); // - in ms

    if (!nRemainingTime || nRemainingTime === null) return callback({ oData: {}, status: response.SUCCESS });

    aPromises.push(oTable.deleteScheduler(`assignWildCardColorTimerExpired`, this.iPlayerId));

    const updatedDiscardPile = [...oTable.toJSON().aDiscardPile];
    updatedDiscardPile[updatedDiscardPile.length - 1].eColor = oData.eColor;
    oTable.emit('resWildCardColor', { iPlayerId: this.iPlayerId, eColor: oData.eColor });
    /* used when user discard his card in grace time. */
    aPromises.push(oTable.update({ eNextCardColor: oData.eColor, aDiscardPile: updatedDiscardPile }));
    await Promise.all(aPromises);
    this.passTurn(oTable);
    return true;
  }

  public async declareUno(oData: any, oTable: Table, callback: ICallback) {
    log.debug(`${_.now()} event: declareUno, player: ${this.iPlayerId}, tableID: ${this.iBattleId}`);
    const eligibleUno = this.aHand.length === 2;
    const playableCards = await this.getPlayableCardIds(oTable.getDiscardPileTopCard(), oTable.toJSON().eNextCardColor);
    if (eligibleUno && playableCards.length && oTable.toJSON().iPlayerTurn === this.iPlayerId) {
      oTable.emit('resUnoPressed', { iPlayerId: this.iPlayerId }, [this.iPlayerId]);
      await this.update({ bUnoDeclared: true, nUnoPressed: this.nUnoPressed + 1 });
      callback({ oData: {}, status: response.SUCCESS });
    } else {
      callback({ oData: {}, status: response.WRONG_UNO });
      return (log.silly(`${_.now()} ${this.iPlayerId} has not valid uno.`) && null) ?? false;
    }
    return true;
  }

  public async leaveMatch(oData: any, oTable: Table, callback: ICallback) {
    log.debug(`${_.now()} event: leaveMatch, player: ${this.iPlayerId}, tableID: ${this.iBattleId}`);
    await this.update({ eState: 'left' });
    callback({ oData: {}, status: response.SUCCESS });
    oTable.emit('resPlayerLeft', { iPlayerId: this.iPlayerId });
    const aPlayingPlayer = oTable.toJSON().aPlayer.filter(p => p.eState !== 'left');
    if (aPlayingPlayer.length <= 1) {
      await oTable.update({ sGameEndReasons: 'User Quit' });
      return oTable.gameOver(aPlayingPlayer[0], 'playerLeft');
    }
    if (oTable.toJSON().iPlayerTurn === this.iPlayerId) return this.passTurn(oTable);
    return true;
  }
}

export default Player;
