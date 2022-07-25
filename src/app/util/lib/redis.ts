/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType, RedisClientOptions } from 'redis';

class RedisClient {
  public readonly gamePlayOptions: RedisClientOptions;

  public readonly schedularOptions: RedisClientOptions;

  public readonly pubSubOptions: RedisClientOptions;

  public readonly client!: RedisClientType;

  public readonly publisher!: RedisClientType;

  public readonly subscriber!: RedisClientType;

  public readonly schedular!: RedisClientType;

  constructor() {
    this.gamePlayOptions = Object.freeze({
      url: `redis://${process.env.GAMEPLAY_REDIS_HOST}:${process.env.GAMEPLAY_REDIS_PORT}`,
      password: process.env.GAMEPLAY_REDIS_PASSWORD,
      legacyMode: false,
    });
    this.schedularOptions = Object.freeze({
      url: `redis://${process.env.SCHEDULER_REDIS_HOST}:${process.env.SCHEDULER_REDIS_PORT}`,
      password: process.env.SCHEDULER_REDIS_PASSWORD,
      legacyMode: false,
    });
    this.pubSubOptions = Object.freeze({
      url: `redis://${process.env.PUBSUB_REDIS_HOST}:${process.env.PUBSUB_REDIS_PORT}`,
      password: process.env.PUBSUB_REDIS_PASSWORD,
      legacyMode: false,
    });
  }

  async initialize() {
    try {
      (this.client as unknown) = createClient(this.gamePlayOptions);
      (this.publisher as unknown) = createClient(this.pubSubOptions);
      (this.subscriber as unknown) = createClient(this.pubSubOptions);
      (this.schedular as unknown) = createClient(this.schedularOptions);

      await Promise.all([this.client.connect(), this.publisher.connect(), this.subscriber.connect(), this.schedular.connect()]);

      await this.client.CONFIG_SET('notify-keyspace-events', 'Ex');
      await this.setupConfig.apply(this);

      this.client.on('error', log.error);
    } catch (error) {
      log.error(error);
    }
  }

  private async setupConfig() {
    await this.subscriber.subscribe(['__keyevent@0__:expired', 'redisEvent'], this.onMessage, false);
    log.info('Redis initialized ⚡');
  }

  public getAdapter() {
    return createAdapter(this.publisher, this.subscriber);
  }

  public async onMessage(message: any, channel: string) {
    let _channel;
    let _message;

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
      parsedMessage = h.parse(_message);
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
