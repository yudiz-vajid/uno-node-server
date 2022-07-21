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
    bMustCollectOnMissTurn: joi_1.default.boolean().optional().default(true),
    bSkipTurnOnDrawTwoOrFourCard: joi_1.default.boolean().optional().default(true),
    bStackingDrawCards: joi_1.default.boolean().optional().default(true),
    bVisualEffectOnUnoButton: joi_1.default.boolean().optional().default(true),
    nTotalGameTime: joi_1.default.number()
        .optional()
        .default(180 * 60 * 1000),
    nTurnTime: joi_1.default.number().optional().default(10000),
    nGraceTime: joi_1.default.number().optional().default(10000),
    nStartingNormalCardCount: joi_1.default.number().optional().default(4),
    nStartingActionCardCount: joi_1.default.number().optional().default(2),
    nStartingSpecialCardCount: joi_1.default.number().optional().default(3),
    nTotalPlayerCount: joi_1.default.number().optional().default(2),
    nUnoTime: joi_1.default.number().optional().default(10000),
    nSpecialMeterFillCount: joi_1.default.number().optional().default(2),
    nGameInitializeTime: joi_1.default.number().optional().default(5000),
    nTotalSkipTurnCount: joi_1.default.number().optional().default(3),
    aCardScore: joi_1.default.array().items(joi_1.default.number().required()).length(15).optional().default([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 20, 20, 50, 50]),
});
function isValidRequest(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { aCardScore: cardScore } = data, rest = __rest(data, ["aCardScore"]);
            if (typeof cardScore === 'string') {
                const aCardScore = cardScore.split(',');
                rest.aCardScore = aCardScore;
            }
            else
                rest.aCardScore = cardScore;
            const result = yield Schema.validateAsync(rest, options);
            return { error: false, info: '', value: result };
        }
        catch (err) {
            return { error: true, info: (_a = err.details[0]) === null || _a === void 0 ? void 0 : _a.message };
        }
    });
}
exports.isValidRequest = isValidRequest;
