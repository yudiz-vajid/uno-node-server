"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./lib/ip");
const util_1 = require("../app/util");
const helper_1 = __importDefault(require("./lib/helper"));
const logs_1 = __importDefault(require("./lib/logs"));
const emitter_1 = __importDefault(require("./lib/emitter"));
const messages_1 = __importDefault(require("./lib/messages"));
global.h = helper_1.default;
global.log = logs_1.default;
global.emitter = emitter_1.default;
global.messages = messages_1.default;
global.redis = new util_1.RedisClient();
