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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tableManager_1 = __importDefault(require("../../tableManager"));
class Channel {
    constructor(iBattleId, iPlayerId) {
        this.logError = function (error, callback) {
            return callback(error, {});
        };
        this.iBattleId = iBattleId;
        this.iPlayerId = iPlayerId;
    }
    startGame(oData, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return callback(oData);
        });
    }
    discardCard(oData, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('discardCard called....');
            const table = yield tableManager_1.default.getTable(this.iBattleId);
            if (!table)
                this.logError(messages.not_found('table'), callback);
            if ((table === null || table === void 0 ? void 0 : table.toJSON().eState) !== 'running')
                return this.logError(messages.discard_card_error_table(table.toJSON().eState), callback);
            const participant = yield tableManager_1.default.getPlayer(this.iBattleId, this.iPlayerId);
            if (!participant)
                return this.logError(messages.not_found('participant'), callback);
            if (!(yield participant.hasValidTurn()))
                return this.logError(messages.custom.wait_for_turn, callback);
            participant.discardCard(oData, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    return this.logError(error, callback);
                callback(null, { oData: { status: 'success' } });
            }));
        });
    }
    drawCard(oData, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('drawCard called....');
            return callback(oData);
        });
    }
    onEvent(body, _ack) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof _ack !== 'function')
                    return false;
                const { sTaskName } = body, oData = __rest(body, ["sTaskName"]);
                switch (sTaskName) {
                    case 'startGame':
                        return this.startGame(oData, _ack);
                    case 'reqDiscardCard':
                        return this.discardCard(oData, _ack);
                    case 'reqDrawCard':
                        return this.drawCard(oData, _ack);
                    default:
                        return false;
                }
            }
            catch (err) {
                log.error(_.now(), `channel.onEvent ${body.sTaskName} failed!!! reason: ${err.message}`);
                return false;
            }
        });
    }
}
exports.default = Channel;
