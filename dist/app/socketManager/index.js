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
class SocketManager {
    constructor() {
        emitter.on('sch', this.onEvents.bind(this));
        emitter.on('redisEvent', this.onEvents.bind(this));
    }
    onEvents(body, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const { taskName, channelId, userId } = body;
            try {
                if (!taskName)
                    throw new Error('empty taskName');
                if (!channelId)
                    throw new Error('empty channelId');
                yield this.executeScheduledTask(taskName, channelId, userId, body, callback);
            }
            catch (error) {
                log.debug(`Error Occurred on onEvents. sTaskName : ${taskName}. reason :${error.message}`);
            }
        });
    }
    executeScheduledTask(taskName, channelId, userId, body, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`${_.now()} executeScheduledTask ${taskName}`);
        });
    }
}
exports.default = SocketManager;
