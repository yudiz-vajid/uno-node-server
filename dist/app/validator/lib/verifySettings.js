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
exports.isValidRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
    allowUnknown: true,
};
const Schema = joi_1.default.object().keys({
    bMustCollectOnMissTurn: joi_1.default.boolean().required(),
    nUnoTime: joi_1.default.number().required(),
    nTurnMissLimit: joi_1.default.number().required(),
    nGraceTime: joi_1.default.number().required(),
    nTurnTime: joi_1.default.number().required(),
    nStartGameTime: joi_1.default.number().required(),
});
function isValidRequest(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Schema.validateAsync(data, options);
            return { error: false, info: '', value: result };
        }
        catch (err) {
            return { error: true, info: (_a = err.details[0]) === null || _a === void 0 ? void 0 : _a.message };
        }
    });
}
exports.isValidRequest = isValidRequest;
