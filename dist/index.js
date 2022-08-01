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
const os_1 = require("os");
require("dotenv/config");
require("./globals/lib/fetch_ip");
require("./globals");
const server_1 = __importDefault(require("./server"));
const sockets_1 = __importDefault(require("./app/sockets"));
const pathFinder_1 = require("./pathFinder");
process.env.UV_THREADPOOL_SIZE = `${(0, os_1.cpus)().length}`;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        log.verbose(process.env.NODE_ENV);
        if (process.env.NODE_ENV !== 'dev')
            yield (0, pathFinder_1.initializePathFinder)();
        yield Promise.all([server_1.default.initialize(), redis.initialize()]);
        yield sockets_1.default.initialize(server_1.default.httpServer);
        log.info(':-)');
    }
    catch (err) {
        log.info(':-(');
        log.error(`reason: ${err.message}, stack: ${err.stack}`);
    }
}))();
process.once('uncaughtException', (ex) => {
    log.error(`${_.now()} we have uncaughtException, ${ex.message}, ${ex.stack}`);
    process.exit(1);
});
process.once('unhandledRejection', (ex) => {
    log.error(`${_.now()} we have unhandledRejection, ${ex.message}, ${ex.stack}`);
    process.exit(1);
});
