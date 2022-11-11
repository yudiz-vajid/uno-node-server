/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType, RedisClientOptions } from 'redis';

class RedisClient {
  public pubSubOptions: RedisClientOptions;

  public schedularOptions: RedisClientOptions;

  public gameplayOptions: RedisClientOptions;

  public redLockOptions: RedisClientOptions;

  public client!: RedisClientType;

  public publisher!: RedisClientType;

  public subscriber!: RedisClientType;

  public sch!: RedisClientType;

  public schSubs!: RedisClientType;

  public redLock!: RedisClientType;

  constructor() {
    this.pubSubOptions = {
      url: `redis://${process.env.PUBSUB_REDIS_HOST}:${process.env.PUBSUB_REDIS_PORT}`,
      username: process.env.PUBSUB_REDIS_USERNAME,
      password: process.env.PUBSUB_REDIS_PASSWORD,
      legacyMode: false,
    };

    this.schedularOptions = {
      url: `redis://${process.env.SCHEDULER_REDIS_HOST}:${process.env.SCHEDULER_REDIS_PORT}`,
      username: process.env.SCHEDULER_REDIS_USERNAME,
      password: process.env.SCHEDULER_REDIS_PASSWORD,
      legacyMode: false,

      // url: `redis://redis-14966.c264.ap-south-1-1.ec2.cloud.redislabs.com:14966`,
      // username: 'default',
      // password: 'YYF9EYtDplvfU1RB8icxtGTYooswpTyr',
    };

    this.gameplayOptions = {
      url: `redis://${process.env.GAMEPLAY_REDIS_HOST}:${process.env.GAMEPLAY_REDIS_PORT}`,
      username: process.env.GAMEPLAY_REDIS_USERNAME,
      password: process.env.GAMEPLAY_REDIS_PASSWORD,
      legacyMode: false,
    };

    this.redLockOptions = {
      url: `redis://${process.env.GAMEPLAY_REDIS_HOST}:${process.env.GAMEPLAY_REDIS_PORT}`,
      username: process.env.GAMEPLAY_REDIS_USERNAME,
      password: process.env.GAMEPLAY_REDIS_PASSWORD,
      legacyMode: false,
    };
    console.log(`pubSubOptions: ${JSON.stringify(this.pubSubOptions)}`);
    console.log(`schedularOptions: ${JSON.stringify(this.schedularOptions)}`);
    console.log(`gameplayOptions: ${JSON.stringify(this.gameplayOptions)}`);
  }

  async initialize() {
    try {
      (this.client as unknown) = createClient(this.gameplayOptions);
      (this.publisher as unknown) = createClient(this.pubSubOptions);
      (this.subscriber as unknown) = createClient(this.pubSubOptions);
      (this.sch as unknown) = createClient(this.schedularOptions);
      (this.schSubs as unknown) = createClient(this.schedularOptions);
      (this.redLock as unknown) = createClient(this.redLockOptions);

      await Promise.all([this.client.connect(), this.publisher.connect(), this.subscriber.connect(), this.sch.connect(), this.schSubs.connect()]);
      try {
        const kspRes = await this.sch.CONFIG_SET('notify-keyspace-events', 'Ex');
        log.info(`ksp: ${kspRes}`);
      } catch (err: any) {
        log.info(`key space error: ${err.message}`);
      }

      await this.setupConfig.apply(this);
      this.client.on('error', log.error);
      this.publisher.on('error', log.error);
      this.subscriber.on('error', log.error);
      this.sch.on('error', log.error);
      this.schSubs.on('error', log.error);
      // this.redLock.on('error', log.error);
    } catch (error) {
      log.error(error);
    }
  }

  private async setupConfig() {
    // await this.subscriber.subscribe(['__keyevent@0__:expired', 'redisEvent'], this.onMessage, false);
    await this.schSubs.subscribe(['__keyevent@0__:expired', 'redisEvent'], this.onMessage, false);
    log.info('Redis initialized ⚡');
  }

  public getAdapter() {
    return createAdapter(this.publisher, this.subscriber);
  }

  public async onMessage(message: any, channel: string) {
    let _channel;
    let _message;
    console.log(`onMessage: keySpaceEvent!!!!!!!!!!!!!: ${message} ${channel}`);

    if (channel === '__keyevent@0__:expired') {
      const [sType, iBattleId, sTaskName, iPlayerId, sHostIp] = message.split(':'); // 'sch:fqr6dlI_2Gg2TcH3_YTfj:assignBot::127.0.0.1' // `sch:${iBattleId}:${sTaskName}:${iPlayerId}:${host}`
      if (sHostIp !== process.env.HOST || sType !== 'sch') return false;
      _channel = sType; // 'sch'
      _message = { sTaskName, iBattleId, iPlayerId };
    } else {
      _channel = channel;
      _message = message;
    }

    let parsedMessage = '';
    try {
      parsedMessage = _.parse(_message);
    } catch (err: any) {
      log.error(`can not parse message -> ${_message} ${{ reason: err.message, stack: err.stack }}`);
      parsedMessage = _message;
    }
    await emitter.asyncEmit(_channel, parsedMessage); // ch : redisEvent | sch
  }
}

export default RedisClient;
/*
    redis.publisher.publish('redisEvent', JSON.stringify({ a: 10, b: 20 }));
    then on onMessage we got :> channel : 'redisEvent, message: '{ a: 10, b: 20 }'

    redis.publisher.publish('redisEvent', JSON.stringify({ sTaskName: '', iTabled: '', iPlayerId: '' }));
     channel : redisEvent
     message: { sTaskName: '', iTabled: '', iPlayerId: '' }

*/

/*
    redis-commander --redis-host redis-14637.c301.ap-south-1-1.ec2.cloud.redislabs.com --redis-port 14637 --redis-password kderTDhubKYjmcW1ilCdjly0fFNdxihJ
    export VIEW_JSON_DEFAULT=all && redis-commander
    redis-cli -h redis-16750.c275.us-east-1-4.ec2.cloud.redislabs.com -p 16750 -a 1LUOg6WlPX6eK15Shtfa0iLUGsdjkNlc
*/

/*
    "local channel = redis.call('zrangebyscore', KEYS[1], ARGV[1], ARGV[2], 'LIMIT', 0, 1);" +
    'channel = unpack(channel);' +
    'if (channel==nil) then return nil; end ' +
    "local isRemoved = redis.call('zrem', KEYS[1], channel);" +
    'if (isRemoved~=1) then return nil; end ' + //
    'return channel;',
*/
