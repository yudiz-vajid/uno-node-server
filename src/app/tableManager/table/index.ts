import TableManager from '..';
import Service from './service';

class Table extends Service {
  public async distributeCard() {
    const { nStartingNormalCardCount,  nStartingSpecialCardCount } = this.oSettings;
    const nInitialCardsPerUser = nStartingNormalCardCount +  nStartingSpecialCardCount; // nStartingSpecialCardCount -> nStartingWildCardCount

    if (this.aDrawPile.length <= this.aPlayer.length * nInitialCardsPerUser) return (log.error(`Not enough cards in the draw pile to distribute to all players`) && null) ?? false;

    this.aPlayer.forEach(async player => {
      log.verbose(`length(drawPile): ${this.aDrawPile.length} `);
      const aNormalCard = this.drawCard('normal', nStartingNormalCardCount);
      if (!aNormalCard) return (log.error(`Could not draw normal cards for player ${player.toJSON().iPlayerId}`) && null) ?? false;
      // const aActionCard = this.drawCard('action', nStartingActionCardCount);
      // if (!aActionCard) return (log.error(`Could not draw action cards for player ${player.toJSON().iPlayerId}`) && null) ?? false;
      const aWildCard = this.drawCard('wild', nStartingSpecialCardCount); // w(13) + w4(14)
      if (!aWildCard) return (log.error(`Could not draw wild cards for player ${player.toJSON().iPlayerId}`) && null) ?? false;
      await player.setHand(aNormalCard,  aWildCard);
      return true;
    });

    const oDiscardPileTopCard = this.drawCard('normal', 1); // - should not be special card
    if (!oDiscardPileTopCard) return (log.error(`Could not draw discard pile top card`) && null) ?? false;
    this.aDiscardPile.push(...oDiscardPileTopCard);

    await this.updateDrawPile(this.aDrawPile);
    await this.updateDiscardPile(this.aDiscardPile);
    await this.update({eState:'running'});

    await _.delay(5000); // TODO: get from client
    this.emit('resDiscardPileTopCard', { oDiscardPileTopCard: this.aDiscardPile[this.aDiscardPile.length - 1] });
    this.emit('resInitMasterTimer', { ttl: this.oSettings.nTotalGameTime, timestamp: Date.now() });
    this.setSchedular('masterTimerExpired', '', this.oSettings.nTotalGameTime); // -  game lifetime second
    this.assignRandomTurn()
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  public async masterTimerExpired() {
    log.verbose('masterTimerExpired, game should end now');
    this.emit('resMasterTimerExpired', {});
    return true;
  }

  public async gameInitializeTimerExpired() {
    log.verbose('gameInitializeTimerExpired, game should start now');
    this.emit('resGameInitializeTimerExpired', {});
    this.setSchedular('distributeCard', '', 2000); // TODO: replace with nAnimationDelay
    return true;
  }

 public async getNextParticipant(previousSeat:any='') {
   const playingPlayers=await TableManager.getTablePlayers(this.iBattleId)
   let participant
   if(this.bTurnClockwise){ 
     participant=playingPlayers.find((p:any) => p.nSeat > previousSeat && p.eState === 'playing')
    if (!participant) participant = this.aPlayer.find((p) => p.toJSON().nSeat >= 0 && p.toJSON().eState === 'playing');
  }else{
    participant=playingPlayers.find((p:any) => p.toJSON().nSeat < previousSeat && p.toJSON().eState === 'playing');;
    if (!participant) participant = this.aPlayer.find((p) => p.toJSON().nSeat <= playingPlayers.length && p.toJSON().eState === 'playing');
   }
    return await this.getPlayer(participant.iPlayerId);
}

  // public async assignTurnTimerExpired(iPlayerId:any='') {
  //   log.verbose('assignTurnTimerExpired, assign grace timer');
  //   const turnPlayer:any=await this.getPlayer(iPlayerId)
  //   if (turnPlayer?.toJSON().nGraceTime < 3) return this.assignTurnTimeout(); // Nothing changed in table so no need to save it.
  //   this.emit('resTurnTimer',{bIsGraceTimer:true,iPlayerId:iPlayerId,ttl:turnPlayer?.toJSON().nGraceTime,timestamp :Date.now(),aPlayableCards:[]})
  //   this.setSchedular('assignGraceTimerExpired', iPlayerId, turnPlayer?.toJSON().nGraceTime); // TODO: replace with nAnimationDelay
  //   return true;
  // }
}

export default Table;
