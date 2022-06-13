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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof ack !== 'function')
                    return false;
                const { sTaskName, oData } = body;
                switch (sTaskName) {
                    case 'reqDrawCard':
                        emitter.emit('channelEvent', { sTaskName: 'drawCard', iBattleId: this.iBattleId, iPlayerId: (_a = this.iPlayerId) !== null && _a !== void 0 ? _a : '', oData }, ack);
                        break;
                    case 'reqDiscardCard':
                        emitter.emit('channelEvent', { sTaskName: 'discardCard', iBattleId: this.iBattleId, iPlayerId: (_b = this.iPlayerId) !== null && _b !== void 0 ? _b : '', oData }, ack);
                        break;
                    default:
                        return false;
                }
                return true;
            }
            catch (err) {
                log.error(_.now(), `channel.onEvent ${body.sTaskName} failed!!! reason: ${err.message}`);
                return false;
            }
        });
    }
}
exports.default = Channel;
