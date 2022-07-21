"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigProvider = void 0;
var node_zookeeper_client_1 = __importStar(require("node-zookeeper-client"));
var Logger_1 = require("../logging/Logger");
var constants_1 = require("../utils/constants");
var ZookeeperConfig_1 = __importDefault(require("./ZookeeperConfig"));
var ConfigProvider = /** @class */ (function () {
    function ConfigProvider() {
        this.configsMap = new Map();
        this.retryConnectCount = 10;
        this.initiateZKClient();
    }
    ConfigProvider.getInstance = function () {
        if (!this.instance) {
            Logger_1.Logger.debug("Config Provider not initialized yet, initiating the class");
            this.instance = new ConfigProvider();
        }
        return this.instance;
    };
    ConfigProvider.prototype.registerPath = function (path) {
        Logger_1.Logger.debug("Registration started for path: ", path);
        var configs = new ZookeeperConfig_1.default(path);
        this.configsMap.set(path, configs);
    };
    ConfigProvider.prototype.getConfigs = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var configCls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.configsMap.has(path)) {
                            Logger_1.Logger.debug("Configs for the path not available yet: ", path);
                            this.registerPath(path);
                        }
                        Logger_1.Logger.debug("Call to getConfigs for path: ", path);
                        configCls = this.configsMap.get(path);
                        if (!configCls) {
                            throw new Error("Something unexpected happened. check logs for more details.");
                        }
                        return [4 /*yield*/, this.awakeZkClient()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, configCls.getData(this.zkClient)];
                }
            });
        });
    };
    ConfigProvider.prototype.initiateZKClient = function () {
        Logger_1.Logger.debug("Call to initiateZKClient");
        this.zkClient = node_zookeeper_client_1.default.createClient(constants_1.ZK_CONFIG_URLS);
    };
    ConfigProvider.prototype.awakeZkClient = function (forceConnect) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                Logger_1.Logger.debug("Call to awakeZkClient");
                Logger_1.Logger.info("Current listener count for zk is: ", this.zkClient.listenerCount);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var currentState = _this.zkClient.getState();
                        if (forceConnect ||
                            currentState === node_zookeeper_client_1.State.DISCONNECTED ||
                            currentState === node_zookeeper_client_1.State.EXPIRED) {
                            _this.initiateZKClient();
                            // if (forceConnect) this.zkClient.close();
                            Logger_1.Logger.debug("Client is currently disconnected");
                            // this.zkClient.once(EVENT_CONNECTED, () => {
                            //   Logger.debug("Client is now connected");
                            //   // reseting the re-connect count
                            //   this.retryConnectCount = 10;
                            //   return resolve();
                            // });
                            _this.zkClient.on(constants_1.EVENT_CONNECTED, function () {
                                Logger_1.Logger.debug("Client is now connected");
                                // reseting the re-connect count
                                _this.retryConnectCount = 10;
                                return resolve();
                            });
                            // this.zkClient.once(EVENT_CONNECTED_READY_ONLY, () => {
                            //   Logger.debug("Client is now connected in read only mode");
                            //   return resolve();
                            // });
                            _this.zkClient.connect();
                        }
                        else if (currentState === node_zookeeper_client_1.State.SYNC_CONNECTED
                        // || currentState === State.CONNECTED_READ_ONLY
                        ) {
                            Logger_1.Logger.debug("Client is already connected");
                            return resolve();
                        }
                        else {
                            Logger_1.Logger.debug("Client is unknown state");
                            if (_this.retryConnectCount > 0) {
                                Logger_1.Logger.debug("Retrying to connect to zk again");
                                _this.retryConnectCount -= 1;
                                return _this.awakeZkClient(true);
                            }
                            else {
                                Logger_1.Logger.debug("After 10 retries, zk still not available to connect to");
                                return reject(constants_1.UNKNOWN_STATE);
                            }
                        }
                    })];
            });
        });
    };
    return ConfigProvider;
}());
exports.ConfigProvider = ConfigProvider;
exports.default = ConfigProvider;
