/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType, RedisClientOptions } from 'redis';

class RedisClient {
  public options: RedisClientOptions;

  public client!: RedisClientType;

  public publisher!: RedisClientType;

  public subscriber!: RedisClientType;

  constructor() {
    this.options = {
      url: process.env.REDIS_URL,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      legacyMode: false,
    };
  }

  async initialize() {
    try {
      (this.client as any) = createClient(this.options);
      (this.publisher as any) = createClient(this.options);
      (this.subscriber as any) = createClient(this.options);

      await Promise.all([this.client.connect(), this.publisher.connect(), this.subscriber.connect()]);

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
      const [type, channelId, taskName, userId, ip] = message.split(':'); // 'sch:fqr6dlI_2Gg2TcH3_YTfj:assignBot::127.0.0.1'
      if (ip !== process.env.HOST || type !== 'sch') return false;
      _channel = type; // 'sch'
      _message = { taskName, channelId, userId };
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

    redis.publisher.publish('redisEvent', JSON.stringify({ sTaskName: '', iTabled: '', iUserId: '' }));
     channel : redisEvent
     message: { sTaskName: '', iTabled: '', iUserId: '' }

*/

/*
    redis-commander --redis-host redis-16750.c275.us-east-1-4.ec2.cloud.redislabs.com --redis-port 16750 --redis-password 1LUOg6WlPX6eK15Shtfa0iLUGsdjkNlc
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
