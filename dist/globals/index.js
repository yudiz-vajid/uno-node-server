"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_pathfinder_node_1 = __importDefault(require("lib-pathfinder-node"));
require("./lib/fetch_ip");
const logs_1 = __importDefault(require("./lib/logs"));
const helper_1 = __importDefault(require("./lib/helper"));
const messages_1 = __importDefault(require("./lib/messages"));
const emitter_1 = __importDefault(require("./lib/emitter"));
global._ = helper_1.default;
global.log = logs_1.default;
global.emitter = emitter_1.default;
global.messages = messages_1.default;
global.PF = lib_pathfinder_node_1.default;
