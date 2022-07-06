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
exports.ZookeeperConfig = void 0;
var node_zookeeper_client_1 = require("node-zookeeper-client");
var cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
var Logger_1 = require("../logging/Logger");
var ZookeeperConfig = /** @class */ (function () {
    function ZookeeperConfig(path) {
        Logger_1.Logger.debug("Initializing Zookeeper for path: ", path);
        this.path = path;
    }
    ZookeeperConfig.prototype.getData = function (zkClient) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.configData) {
                            Logger_1.Logger.debug("Returning already fetched data for path: ", this.path);
                            return [2 /*return*/, Promise.resolve(this.configData)];
                        }
                        Logger_1.Logger.debug("Data not available yet, fetching for path: ", this.path);
                        _a = this;
                        return [4 /*yield*/, this.getZkData(zkClient)];
                    case 1:
                        _a.configData = _b.sent();
                        Logger_1.Logger.debug("Returning the data for path: ", this.path);
                        return [2 /*return*/, Promise.resolve(this.configData)];
                }
            });
        });
    };
    ZookeeperConfig.prototype.getZkData = function (zkClient) {
        var _this = this;
        if (this.dataPromise) {
            Logger_1.Logger.debug("Returning Promise from previous request for path: ", this.path);
            return this.dataPromise;
        }
        this.dataPromise = new Promise(function (resolve, reject) {
            zkClient.getData(_this.path, function (e) { return _this.setWatcher(e, zkClient); }, function (error, data) {
                if (error) {
                    Logger_1.Logger.error("Got the error for path from zookeeper: ", _this.path, error);
                    return reject(error);
                }
                Logger_1.Logger.debug("Got the data for path from zookeeper: ", _this.path);
                return resolve(JSON.parse(data.toString("utf8")));
            });
        });
        return this.dataPromise;
    };
    ZookeeperConfig.prototype.setWatcher = function (event, zkClient) {
        if (event.getType() === node_zookeeper_client_1.Event.NODE_DATA_CHANGED) {
            Logger_1.Logger.debug("Node Data Change event for node: ", this.path);
            this.refreshConfigData(zkClient);
        }
    };
    ZookeeperConfig.prototype.refreshConfigData = function (zkClient) {
        return __awaiter(this, void 0, void 0, function () {
            var currentValue, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        currentValue = cloneDeep_1.default(this.configData);
                        Logger_1.Logger.debug("Refreshing the data for path: ", this.path);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.getZkData(zkClient)];
                    case 2:
                        _a.configData = _b.sent();
                        Logger_1.Logger.info("Refreshed updated data at path: ", this.path);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        this.configData = currentValue;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ZookeeperConfig;
}());
exports.ZookeeperConfig = ZookeeperConfig;
exports.default = ZookeeperConfig;
