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
const socket_io_1 = require("socket.io");
const rootSocket_1 = __importDefault(require("./lib/rootSocket"));
const tableManager_1 = __importDefault(require("../tableManager"));
class SocketIO {
    constructor() {
        this.options = {
            pingInterval: 10000,
            pingTimeout: 8000,
            maxHttpBufferSize: 1e8,
            allowUpgrades: true,
            perMessageDeflate: false,
            serveClient: true,
            cookie: false,
            transports: ['websocket'],
            path: '/socket.io/',
            connectTimeout: 45000,
            allowEIO3: true,
            parser: require('socket.io-parser'),
            cors: {
                origin: '*:*',
                methods: ['GET', 'POST'],
                credentials: false,
            },
        };
    }
    initialize(httpServer) {
        return __awaiter(this, void 0, void 0, function* () {
            const io = new socket_io_1.Server(httpServer, this.options);
            io.adapter(redis.getAdapter());
            global.io = io;
            yield rootSocket_1.default.initialize();
            new tableManager_1.default();
            log.info('Socket.io initialized 🔌');
        });
    }
}
const socket = new SocketIO();
exports.default = socket;
