/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import Service from './service';
import type Player from '../player';

class Table extends Service {
  public async distributeCard() {
    // eslint-disable-next-line prefer-const
    log.debug(`${_.now()} event: distributeCard, tableID: ${this.iBattleId}`);
    let { nStartingActionCardCount } = this.oSettings;
    const { nStartingNormalCardCount, nStartingSpecialCardCount } = this.oSettings;
    nStartingActionCardCount = nStartingActionCardCount || _.getRandomNumber(2, 3);
    const nStartingWildCardCount = nStartingSpecialCardCount - nStartingActionCardCount;
    const nInitialCardsPerUser = nStartingNormalCardCount + nStartingSpecialCardCount;

    if (this.aDrawPile.length <= this.aPlayer.length * nInitialCardsPerUser) return (log.error(`Not enough cards in the draw pile to distribute to all players`) && null) ?? false;

    this.aPlayer.forEach(async player => {
      const aNormalCard = await this.drawCard('normal', nStartingNormalCardCount); // 1-9
      if (!aNormalCard) return (log.error(`Could not draw normal cards for player ${player.toJSON().iPlayerId}`) && null) ?? false;
      const aActionCard = await this.drawCard('action', nStartingActionCardCount); // 10-12
      if (!aActionCard) return (log.error(`Could not draw action cards for player ${player.toJSON().iPlayerId}`) && null) ?? false;
      const aWildCard = await this.drawCard('wild', nStartingWildCardCount); // 13-14
      if (!aWildCard) return (log.error(`Could not draw wild cards for player ${player.toJSON().iPlayerId}`) && null) ?? false;
      await player.setHand(aNormalCard, aActionCard, aWildCard);
      return true;
    });

    const oDiscardPileTopCard = await this.drawCard('normal', 1); // - should not be special card
    if (!oDiscardPileTopCard) return (log.error(`Could not draw discard pile top card`) && null) ?? false;
    this.aDiscardPile.push(...oDiscardPileTopCard);

    await Promise.all([
      this.updateDrawPile(this.aDrawPile),
      this.updateDiscardPile(this.aDiscardPile),
      this.update({ eState: 'running' }),
      //
    ]);

    this.assignRandomTurn(); // assign turn to random player
    await _.delay(this.aPlayerId.length * 250 * (1 + this.oSettings.nStartingNormalCardCount + this.oSettings.nStartingSpecialCardCount));
    this.emit('resDiscardPileTopCard', { oDiscardPileTopCard: this.getDiscardPileTopCard() });
    this.emit('resInitMasterTimer', { ttl: this.oSettings.nTotalGameTime, timestamp: Date.now() });
    this.setSchedular('masterTimerExpired', '', this.oSettings.nTotalGameTime); // -  game lifetime second
    this.setSchedular('masterTimerWillExpire', '', this.oSettings.nTotalGameTime - this.oSettings.nFastTimerAt); // -  game last time (60-10)
    // this.assignRandomTurn(); // assign turn to random player // commented here to handle reconnection issue
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  public async masterTimerExpired() {
    log.debug(`${_.now()} event: master Timer Expired, tableID: ${this.iBattleId}`);
    this.emit('resMasterTimerExpired', {});
    const aPlayingPlayer = this.aPlayer.filter(p => p.toJSON().eState === 'playing');
    for (const player of aPlayingPlayer) {
      player.nScore = await player.handCardCounts(player.aHand);
    }
    const sortedPlayer = aPlayingPlayer.sort((a, b) => a.nScore - b.nScore);
    await _.delay(1500);
    if (this.iDrawPenltyPlayerId) {
      const penaltyUser = this.getPlayer(this.iDrawPenltyPlayerId);
      if (penaltyUser?.eState === 'playing') await penaltyUser.assignDrawPenalty(this);
    }
    await this.update({ sGameEndReasons: 'Out of Time' });
    this.gameOver(sortedPlayer[0], 'masterTimerExpire');
    return true;
  }

  public async matchMakingExpired() {
    log.debug(`${_.now()} event: server match Making Expired, tableID: ${this.iBattleId},player count ${this.aPlayerId.length}`);
    if (this.aPlayerId.length < this.nMinTablePlayer) return this.refundOnLongWait();
    log.verbose('Game start with MinTablePlayer');
    return this.initializeGame();
  }

  public async masterTimerWillExpire() {
    log.debug(`${_.now()} event: master Timer Will Expire, tableID: ${this.iBattleId}`);
    this.emit('resMasterTimerWillExpire', {});
    const updatedSettings = { ...this.oSettings, nTurnTime: this.oSettings.nTurnTime / 2 };
    await this.update({ oSettings: updatedSettings });
    return true;
  }

  public async gameInitializeTimerExpired() {
    log.debug(`${_.now()} event: game Initialize Timer Expired, tableID: ${this.iBattleId}`);
    this.emit('resGameInitializeTimerExpired', {});
    this.setSchedular('distributeCard', '', 100);
    return true;
  }

  /**
   * assign turn to random player
   */
  public async assignRandomTurn() {
    const oRandomPlayer = _.randomizeArray(this.aPlayer)[0];
    await this.update({ iPlayerTurn: oRandomPlayer.iPlayerId, dTurnAssignedAt: new Date() });
    await _.delay(this.aPlayerId.length * 250 * (1 + this.oSettings.nStartingNormalCardCount + this.oSettings.nStartingSpecialCardCount));
    log.verbose(`this.aPlayer --> ${this.aPlayer}`);
    log.verbose(`oRandomPlayer --> ${oRandomPlayer}`);
    oRandomPlayer.takeTurn(this);
  }

  public getDiscardPileTopCard() {
    return this.aDiscardPile[this.aDiscardPile.length - 1];
  }

  public async getNextPlayer(nPreviousSeat: number) {
    const aPlayingPlayer = this.aPlayer.filter(p => p.eState !== 'left');
    if (!aPlayingPlayer.length) return (log.error(`No players have eState 'playing'`) && null) ?? null;

    let oPlayer: Player | undefined;
    if (this.bTurnClockwise) {
      aPlayingPlayer.sort((p1, p2) => p1.toJSON().nSeat - p2.toJSON().nSeat); // - sort in asc order // 1,2,3,4
      oPlayer = aPlayingPlayer.find(p => p.toJSON().nSeat > nPreviousSeat);
      if (!oPlayer) oPlayer = aPlayingPlayer.find(p => p.toJSON().nSeat < nPreviousSeat);
    } else {
      aPlayingPlayer.sort((p1, p2) => p2.toJSON().nSeat - p1.toJSON().nSeat); // - sort in dsc order // 4,3,2,1
      oPlayer = aPlayingPlayer.find(p => p.toJSON().nSeat < nPreviousSeat);
      if (!oPlayer) oPlayer = aPlayingPlayer.find(p => p.toJSON().nSeat > nPreviousSeat);
    }
    if (!oPlayer) return (log.error(`No player found`) && null) ?? null;
    return oPlayer;
  }

  public hasValidTurn(iPlayerId: string) {
    const oPlayer = this.aPlayer.find(p => p.toJSON().iPlayerId === iPlayerId);
    if (!oPlayer) return false;
    return this.iPlayerTurn === iPlayerId && oPlayer.toJSON().eState !== 'left';
  }
}

export default Table;
