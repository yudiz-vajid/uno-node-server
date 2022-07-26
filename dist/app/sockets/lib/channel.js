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
class Channel {
    constructor(iBattleId, iPlayerId) {
        this.iBattleId = iBattleId;
        this.iPlayerId = iPlayerId;
    }
    onEvent(body, ack) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'dev' && typeof body === 'object')
                body = _.stringify(body);
            const parseBody = JSON.parse(body);
            try {
                if (typeof ack !== 'function')
                    return false;
                const { sTaskName, oData } = parseBody;
                switch (sTaskName) {
                    case 'reqDrawCard':
                        emitter.emit('channelEvent', { sTaskName: 'drawCard', iBattleId: this.iBattleId, iPlayerId: (_a = this.iPlayerId) !== null && _a !== void 0 ? _a : '', oData }, ack);
                        break;
                    case 'reqDiscardCard':
                        emitter.emit('channelEvent', { sTaskName: 'discardCard', iBattleId: this.iBattleId, iPlayerId: (_b = this.iPlayerId) !== null && _b !== void 0 ? _b : '', oData }, ack);
                        break;
                    case 'reqKeepCard':
                        emitter.emit('channelEvent', { sTaskName: 'keepCard', iBattleId: this.iBattleId, iPlayerId: (_c = this.iPlayerId) !== null && _c !== void 0 ? _c : '', oData }, ack);
                        break;
                    case 'reqSetWildCardColor':
                        emitter.emit('channelEvent', { sTaskName: 'setWildCardColor', iBattleId: this.iBattleId, iPlayerId: (_d = this.iPlayerId) !== null && _d !== void 0 ? _d : '', oData }, ack);
                        break;
                    case 'reqUno':
                        emitter.emit('channelEvent', { sTaskName: 'decalreUno', iBattleId: this.iBattleId, iPlayerId: (_e = this.iPlayerId) !== null && _e !== void 0 ? _e : '', oData }, ack);
                        break;
                    case 'reqLeave':
                        emitter.emit('channelEvent', { sTaskName: 'leaveMatch', iBattleId: this.iBattleId, iPlayerId: (_f = this.iPlayerId) !== null && _f !== void 0 ? _f : '', oData }, ack);
                        break;
                    default:
                        return false;
                }
                return true;
            }
            catch (err) {
                log.error(_.now(), `channel.onEvent ${parseBody.sTaskName} failed!!! reason: ${err.message}`);
                return false;
            }
        });
    }
}
exports.default = Channel;
