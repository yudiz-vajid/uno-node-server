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
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const routers_1 = __importDefault(require("../app/routers"));
class Server {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app = (0, express_1.default)();
            this.httpServer = http_1.default.createServer(this.app);
            this.setupMiddleware();
            this.setupServer();
            global.app = this.app;
        });
    }
    setupMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json({ limit: '100kb' }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            next();
        });
        this.app.use('/', routers_1.default);
    }
    setupServer() {
        this.httpServer.timeout = 10000;
        this.httpServer.listen(process.env.PORT, () => log.info(`Spinning on ${process.env.PORT} 🌀`));
    }
}
const server = new Server();
exports.default = server;
