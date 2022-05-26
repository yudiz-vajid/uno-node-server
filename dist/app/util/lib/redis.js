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
        this.options = {
            url: process.env.REDIS_URL,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            legacyMode: false,
        };
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.client = (0, redis_1.createClient)(this.options);
                this.publisher = (0, redis_1.createClient)(this.options);
                this.subscriber = (0, redis_1.createClient)(this.options);
                yield Promise.all([this.client.connect(), this.publisher.connect(), this.subscriber.connect()]);
                yield this.client.CONFIG_SET('notify-keyspace-events', 'Ex');
                yield this.setupConfig.apply(this);
                this.client.on('error', log.error);
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
                const [type, channelId, taskName, userId, ip] = message.split(':');
                if (ip !== process.env.HOST || type !== 'sch')
                    return false;
                _channel = type;
                _message = { taskName, channelId, userId };
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
