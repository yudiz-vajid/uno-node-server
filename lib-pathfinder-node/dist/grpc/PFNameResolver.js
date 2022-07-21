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
var ShutdownManager_1 = __importDefault(require("../utils/ShutdownManager"));
var constants_1 = require("../utils/constants");
var SharedObjects_1 = __importDefault(require("../utils/SharedObjects"));
var PFNameResolver = /** @class */ (function () {
    function PFNameResolver(fydeSuffix, isLocalDev, isOnVpn) {
        this.serviceMap = new Map();
        this.watchesMap = new Map();
        this.singleCallMap = new Map();
        this.fydeSuffix = fydeSuffix;
        this.isLocalDev = isLocalDev || false;
        this.isOnVpn = isOnVpn || false;
        ShutdownManager_1.default.getInstance().addShutdownListener(this);
    }
    PFNameResolver.prototype.beforeShutdown = function () {
        this.clearAllWatches();
        return 0;
    };
    PFNameResolver.prototype.afterShutdown = function () {
        return;
    };
    PFNameResolver.initialize = function (fydeSuffix, isLocalDev, isOnVpn) {
        if (this.instance)
            return;
        this.instance = new PFNameResolver(fydeSuffix, isLocalDev, isOnVpn);
    };
    PFNameResolver.getInstance = function () {
        return this.instance;
    };
    PFNameResolver.prototype.getUrl = function (serviceName, tag) {
        if (tag === void 0) { tag = constants_1.TAG_DEFAULT; }
        return __awaiter(this, void 0, void 0, function () {
            var url, tMap, urlFromLastCall;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.getCachedUrl(serviceName, tag);
                        if (url) {
                            return [2 /*return*/, Promise.resolve(url)];
                        }
                        if (!this.singleCallMap.has(serviceName)) return [3 /*break*/, 2];
                        tMap = this.singleCallMap.get(serviceName);
                        if (!(tMap && tMap.has(tag))) return [3 /*break*/, 2];
                        return [4 /*yield*/, tMap.get(tag)];
                    case 1:
                        _a.sent();
                        urlFromLastCall = this.getCachedUrl(serviceName, tag);
                        if (urlFromLastCall)
                            return [2 /*return*/, Promise.resolve(urlFromLastCall)];
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.initAndSetWatcherForPath(serviceName, tag)];
                }
            });
        });
    };
    PFNameResolver.prototype.initAndSetWatcherForPath = function (service, tag) {
        return __awaiter(this, void 0, void 0, function () {
            var resolveRef, rejectRef, tMap, consulClient, data, watch, watchMap, services, errorMessage;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tMap = this.singleCallMap.get(service);
                        if (tMap === null || tMap === undefined)
                            tMap = new Map();
                        tMap.set(tag, new Promise(function (resolve, reject) {
                            resolveRef = resolve;
                            rejectRef = reject;
                        }));
                        this.singleCallMap.set(service, tMap);
                        consulClient = SharedObjects_1.default.getInstance().getConsulClient();
                        return [4 /*yield*/, consulClient.catalog.service.nodes({
                                service: service,
                                tag: tag !== constants_1.TAG_DEFAULT ? tag : undefined,
                            })];
                    case 1:
                        data = _a.sent();
                        watch = consulClient.watch({
                            method: consulClient.catalog.service.nodes,
                            options: { service: service, tag: tag !== constants_1.TAG_DEFAULT ? tag : undefined },
                        });
                        watch.on("change", function (data) {
                            _this.parseServicesFromData(service, tag, data);
                        });
                        watch.on("error", function () {
                            var map = _this.serviceMap.get(service);
                            if (map)
                                map.delete(tag);
                        });
                        watchMap = new Map();
                        watchMap.set(tag, watch);
                        if (!this.watchesMap) {
                            this.watchesMap = new Map();
                        }
                        this.watchesMap.set(service, watchMap);
                        services = this.parseServicesFromData(service, tag, data);
                        if (services === undefined) {
                            errorMessage = "Service Discovery Error: " + service;
                            if (rejectRef)
                                rejectRef(errorMessage);
                            throw new Error(errorMessage);
                        }
                        if (resolveRef)
                            resolveRef();
                        return [2 /*return*/, services[0]];
                }
            });
        });
    };
    PFNameResolver.prototype.parseServicesFromData = function (service, tag, data) {
        var map = new Map();
        if (data === undefined || data.length === 0) {
            this.serviceMap.delete(service);
            this.singleCallMap.delete(service);
            return undefined;
        }
        var services = [];
        for (var i = 0; i < data.length; i++) {
            var service_1 = data[i];
            var path = service_1.Address + ":" + service_1.ServicePort;
            if (this.isLocalDev &&
                !this.isOnVpn &&
                this.fydeSuffix !== undefined &&
                this.fydeSuffix !== "") {
                path =
                    "ip-"
                        .concat(service_1.Address.split(".").join("-"))
                        .concat(this.fydeSuffix)
                        .concat(":") + service_1.ServicePort;
            }
            services.push(path);
        }
        map.set(tag, { currIdx: 0, services: services });
        this.serviceMap.set(service, map);
        return services;
    };
    PFNameResolver.prototype.getCachedUrl = function (serviceName, tag) {
        var map = this.serviceMap.get(serviceName);
        if (map === undefined || !map.has(tag))
            return undefined;
        var data = map.get(tag);
        if (!data)
            return undefined;
        var newIdx = (data.currIdx + 1) % data.services.length;
        map.set(tag, {
            currIdx: newIdx,
            services: data.services,
        });
        return data.services[newIdx];
    };
    PFNameResolver.prototype.clearWatch = function (serviceName, tag) {
        var tWatch = this.watchesMap.get(serviceName);
        if (tWatch) {
            var watch = tWatch.get(tag);
            if (watch) {
                watch.on("end", function () {
                    tWatch.delete(tag);
                });
                watch.end();
            }
        }
    };
    PFNameResolver.prototype.clearAllWatches = function () {
        this.watchesMap.forEach(function (tagMap) {
            tagMap.forEach(function (watch) {
                watch.end();
            });
        });
        this.watchesMap = new Map();
    };
    return PFNameResolver;
}());
exports.default = PFNameResolver;
