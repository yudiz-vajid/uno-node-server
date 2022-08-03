"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
class RedisClient {
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
        };
        this.gameplayOptions = {
            url: `redis://${process.env.GAMEPLAY_REDIS_HOST}:${process.env.GAMEPLAY_REDIS_PORT}`,
            username: process.env.GAMEPLAY_REDIS_USERNAME,
            password: process.env.GAMEPLAY_REDIS_PASSWORD,
            legacyMode: false,
        };
        console.log(`pubSubOptions: ${JSON.stringify(this.pubSubOptions)}`);
        console.log(`schedularOptions: ${JSON.stringify(this.schedularOptions)}`);
        console.log(`gameplayOptions: ${JSON.stringify(this.gameplayOptions)}`);
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.client = (0, redis_1.createClient)(this.gameplayOptions);
                this.publisher = (0, redis_1.createClient)(this.pubSubOptions);
                this.subscriber = (0, redis_1.createClient)(this.pubSubOptions);
                this.sch = (0, redis_1.createClient)(this.schedularOptions);
                yield Promise.all([this.client.connect(), this.publisher.connect(), this.subscriber.connect()]);
                try {
                    yield this.sch.CONFIG_SET('notify-keyspace-events', 'Ex');
                }
                catch (err) {
                }
                yield this.setupConfig.apply(this);
                this.client.on('error', log.error);
                this.publisher.on('error', log.error);
                this.subscriber.on('error', log.error);
                this.sch.on('error', log.error);
            }
            catch (error) {
                log.error(error);
            }
        });
    }
    setupConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.subscriber.subscribe(['__keyevent@0__:expired', 'redisEvent'], this.onMessage, false);
            log.info('Redis initialized ⚡');
        });
    }
    getAdapter() {
        return (0, redis_adapter_1.createAdapter)(this.publisher, this.subscriber);
    }
    onMessage(message, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            let _channel;
            let _message;
            if (channel === '__keyevent@0__:expired') {
                const [sType, iBattleId, sTaskName, iPlayerId, sHostIp] = message.split(':');
                if (sHostIp !== process.env.HOST || sType !== 'sch')
                    return false;
                _channel = sType;
                _message = { sTaskName, iBattleId, iPlayerId };
            }
            else {
                _channel = channel;
                _message = message;
            }
            let parsedMessage = '';
            try {
                parsedMessage = _.parse(_message);
            }
            catch (err) {
                log.error(`can not parse message -> ${_message} ${{ reason: err.message, stack: err.stack }}`);
                parsedMessage = _message;
            }
            yield emitter.asyncEmit(_channel, parsedMessage);
        });
    }
}
exports.default = RedisClient;
