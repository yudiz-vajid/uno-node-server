/* eslint-disable import/no-cycle */
import Table from '.';
import Player from '../player';
import { ITable, ITableWithPlayer, RedisJSON } from '../../../types/global';

class Service {
  private readonly iBattleId: ITableWithPlayer['iBattleId'];

  private iPlayerTurn: ITableWithPlayer['iPlayerTurn'];

  private iSkippedPLayer: ITableWithPlayer['iSkippedPLayer'];

  private aPlayerId: ITableWithPlayer['aPlayerId'];

  private aDrawPile: ITableWithPlayer['aDrawPile'];

  private aDiscardPile: ITableWithPlayer['aDiscardPile'];

  private bToSkip: ITableWithPlayer['bToSkip'];

  private eState: ITableWithPlayer['eState'];

  private eTurnDirection: ITableWithPlayer['eTurnDirection'];

  private eNextCardColor: ITableWithPlayer['eNextCardColor'];

  private nDrawCount: ITableWithPlayer['nDrawCount'];

  private dCreatedAt: ITableWithPlayer['dCreatedAt'];

  private readonly oSettings: ITableWithPlayer['oSettings'];

  private aPlayer: Player[];

  constructor(oData: ITable & { aPlayer?: Player[] }) {
    this.iBattleId = oData.iBattleId;
    this.iPlayerTurn = oData.iPlayerTurn;
    this.iSkippedPLayer = oData.iSkippedPLayer;
    this.aPlayerId = oData.aPlayerId;
    this.aDrawPile = oData.aDrawPile;
    this.aDiscardPile = oData.aDiscardPile;
    this.bToSkip = oData.bToSkip;
    this.eState = oData.eState;
    this.eTurnDirection = oData.eTurnDirection;
    this.eNextCardColor = oData.eNextCardColor;
    this.nDrawCount = oData.nDrawCount;
    this.dCreatedAt = oData.dCreatedAt;
    this.oSettings = oData.oSettings;
    this.aPlayer = oData.aPlayer ?? [];
  }

  public distributeCards() {
    // return Deck.aDeck.slice(0, 7);
    log.info(this.aDrawPile);
  }

  public async update(
    oDate: Partial<
      Pick<ITable, 'iPlayerTurn' | 'iSkippedPLayer' | 'aPlayerId' | 'aDrawPile' | 'aDiscardPile' | 'bToSkip' | 'eState' | 'eTurnDirection' | 'eNextCardColor' | 'nDrawCount'>
    >
  ) {
    try {
      const aPromise: Array<Promise<unknown>> = [];
      const sTableKey = _.getTableKey(this.iBattleId);
      Object.entries(oDate).forEach(([k, v]) => {
        switch (k) {
          case 'iPlayerTurn':
            this.iPlayerTurn = v as ITable['iPlayerTurn'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'iSkippedPLayer':
            this.iSkippedPLayer = v as ITable['iSkippedPLayer'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'aPlayerId':
            // WARNING: should be called only through Table.addPlayer()
            this.aPlayerId = v as ITable['aPlayerId'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'aDrawPile':
            this.aDrawPile = v as ITable['aDrawPile'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'aDiscardPile':
            this.aDiscardPile = v as ITable['aDiscardPile'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'bToSkip':
            this.bToSkip = v as ITable['bToSkip'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'eState':
            this.eState = v as ITable['eState'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'eTurnDirection':
            this.eTurnDirection = v as ITable['eTurnDirection'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'eNextCardColor':
            this.eNextCardColor = v as ITable['eNextCardColor'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          case 'nDrawCount':
            this.nDrawCount = v as ITable['nDrawCount'];
            aPromise.push(redis.client.json.SET(sTableKey, `.${k}`, v as RedisJSON));
            break;
          default:
            break;
        }
      });
      const aRedisSetResponse = (await Promise.all(aPromise)) as Array<'OK' | null>;
      if (aRedisSetResponse.some(ok => !ok)) log.error('Table.update: redis.client.json.SET failed for some key');

      return this.toJSON();
    } catch (err: any) {
      log.error(`Error Occurred on Table.update(). reason :${err.message}`);
      log.silly(this.toJSON());
      return null;
    }
  }

  public async getPlayer(iPlayerId: string) {
    return this.aPlayer.find(oParticipant => oParticipant.toJSON().iPlayerId === iPlayerId) ?? null;
  }

  // eslint-disable-next-line class-methods-use-this
  public async initializeGame() {
    console.log('initializeGame called ...');
    this.initializeGameTimer();
  }

  public async initializeGameTimer() {
    const nBeginCountdown = this.aPlayerId.length === this.oSettings.nTotalPlayerCount ? this.oSettings.nGameInitializeTime / 2 : this.oSettings.nGameInitializeTime;
    let nBeginCountdownCounter = nBeginCountdown / 1000;

    const initialTimer = setInterval(async () => {
      if (nBeginCountdownCounter > 1 && nBeginCountdownCounter < 3 && this.eState !== 'running') this.update({ eState: 'initialized' });
      if (nBeginCountdownCounter > 0) {
        this.emit('resGameInitializeTimer', { value: (nBeginCountdownCounter -= 1) });
        return;
      }
      clearInterval(initialTimer);
      // emitter.emit('reqSchedule', 'distributeCard', this.iBattleId);
      this.setSchedular('distributeCard');
    }, 1000);
  }

  public async addPlayer(oPlayer: Player) {
    const tablePlayerId = [...this.aPlayerId, oPlayer.toJSON().iPlayerId];

    const ePreviousState = this.eState;
    console.log(`tablePlayerId.length :: `, tablePlayerId.length);
    console.log(`this.oSettings.nTotalPlayerCount :: `, this.oSettings.nTotalPlayerCount);
    // eslint-disable-next-line eqeqeq
    const bInitializeTable = tablePlayerId.length == this.oSettings.nTotalPlayerCount && this.eState === 'waiting';
    console.log(`bInitializeTable :: `, bInitializeTable);
    this.eState = bInitializeTable ? 'initialized' : this.eState;

    const oUpdateTable = await this.update({ aPlayerId: tablePlayerId });
    if (!oUpdateTable) return false;
    this.aPlayer.push(oPlayer);

    if (ePreviousState === 'waiting' && this.eState === 'initialized') {
      // this.deleteScheduler('refundOnLongWait'); // TODO :- Add refunc process
      this.initializeGame();
      log.verbose('Need to start the game....');
    }

    return true;
  }

  public async distributeCard(oTable: Table) {
    if (this.aDrawPile.length <= this.aPlayer.length * 7) return this.emit('resOfError', messages.getString('rummy_not_enough_cards'));
    this.aPlayer.forEach(player => player.setHand(oTable));
    return true;
  }

  public async setSchedular(sTaskName = '', iPlayerId = '', nTimeMS = 0) {
    try {
      if (!sTaskName) return false;
      if (!nTimeMS) return false;
      await redis.client.pSetEx(_.getSchedulerKey(sTaskName, this.iBattleId, iPlayerId), nTimeMS, sTaskName);
      return true;
    } catch (err: any) {
      log.error(`table.setSchedular() failed.${{ reason: err.message, stack: err.stack }}`);
      return false;
    }
  }

  public async deleteScheduler(sTaskName = '', iPlayerId = '*') {
    try {
      const sKey = _.getSchedulerKey(sTaskName, this.iBattleId, iPlayerId);
      const schedularKeys = await redis.client.keys(sKey); // TODO : non efficient, use scan instead
      if (!schedularKeys.length) {
        throw new Error(`schedular doesn't exists`);
      }
      const deletionCount = await redis.client.del(schedularKeys);
      if (!deletionCount) throw new Error(`can't delete key: ${schedularKeys}`);
      log.silly(`deleted scheduled keys: ${schedularKeys}`);
      return true;
    } catch (err: any) {
      log.error(`table.deleteScheduler(sTaskName: ${sTaskName}, iPlayerId: ${iPlayerId}, iBattleId: ${this.iBattleId}) failed. reason: ${err.message}`);
      return false;
    }
  }

  public async emit(sEventName: string, oData: Record<string, unknown>) {
    try {
      this.aPlayer.forEach(p => p.emit(sEventName, oData));
    } catch (err: any) {
      log.error('Table.emit() failed !!!', { reason: err.message });
    }
  }

  public toJSON() {
    return {
      iBattleId: this.iBattleId,
      iPlayerTurn: this.iPlayerTurn,
      iSkippedPLayer: this.iSkippedPLayer,
      aPlayerId: this.aPlayerId,
      aDrawPile: this.aDrawPile,
      bToSkip: this.bToSkip,
      eState: this.eState,
      eTurnDirection: this.eTurnDirection,
      eNextCardColor: this.eNextCardColor,
      nDrawCount: this.nDrawCount,
      dCreatedAt: this.dCreatedAt,
      oSettings: this.oSettings,
      aPlayer: this.aPlayer, //  WARNING : dont save using toJSON() as it contain non-existed field 'aPlayer'
    };
  }
}

export default Service;
