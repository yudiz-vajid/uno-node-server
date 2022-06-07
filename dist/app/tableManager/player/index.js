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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("./service"));
class Player extends service_1.default {
    setHand(aNormalCard, aWildCard) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(`setHand called for user ${this.iPlayerId}`);
            this.aHand.push(...aNormalCard);
            this.aHand.push(...aWildCard);
            yield this.update({ aHand: this.aHand });
            this.emit('resHand', { aHand: this.aHand });
        });
    }
}
exports.default = Player;
