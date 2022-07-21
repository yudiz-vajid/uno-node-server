"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PFClientProvider_1 = __importDefault(require("./grpc/PFClientProvider"));
var PFNameResolver_1 = __importDefault(require("./grpc/PFNameResolver"));
var ServiceAlias_1 = __importDefault(require("./grpc/ServiceAlias"));
var Logger_1 = require("./logging/Logger");
var constants_1 = require("./utils/constants");
var SharedObjects_1 = __importDefault(require("./utils/SharedObjects"));
var PathFinder = /** @class */ (function () {
    function PathFinder() {
        this.aliases = new Set();
    }
    /**
     * Method to get singleton instance of type PathFinder
     * @returns Instace of class PathFinder
     */
    PathFinder.getInstance = function () {
        return this.instance;
    };
    /**
     * Mehotd to initailze the PathFinder library, make sure to call it once in the root of the application
     * @param param0 Object of Type PFInitOptions
     * @returns void
     */
    PathFinder.initialize = function (_a) {
        var appName = _a.appName, protosToLoad = _a.protosToLoad, promisify = _a.promisify, loadOpts = _a.loadOpts, envToConsider = _a.envToConsider, loggerOptions = _a.loggerOptions, disableProtoSyncLoading = _a.disableProtoSyncLoading;
        if (this.instance)
            return;
        var isLocalDev = constants_1.isRunningLocally();
        var isOnVpn = constants_1.isRunningOverVPN();
        if (isLocalDev && !envToConsider) {
            envToConsider = constants_1.Enviroments.DEV;
        }
        SharedObjects_1.default.initialize(envToConsider
            ? isOnVpn
                ? constants_1.VpnEnvMap[envToConsider].consulHost
                : constants_1.FydeEnvMap[envToConsider].consulHost
            : undefined);
        PFNameResolver_1.default.initialize(envToConsider ? constants_1.FydeEnvMap[envToConsider].fydeSuffix : undefined, isLocalDev, isOnVpn);
        PFClientProvider_1.default.initialize(promisify);
        Logger_1.Logger.initialize(appName, loggerOptions);
        if (protosToLoad && !constants_1.isRunningOnJenkins()) {
            PFClientProvider_1.default.getInstance().loadProtos(protosToLoad, loadOpts, disableProtoSyncLoading);
        }
        this.instance = new PathFinder();
    };
    PathFinder.prototype.getServerUrl = function (serviceName, tag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, PFNameResolver_1.default.getInstance().getUrl(serviceName, tag)];
            });
        });
    };
    PathFinder.prototype.startProtoLoading = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, PFClientProvider_1.default.getInstance().startAsyncLoading()];
            });
        });
    };
    /**
     * @deprecated
     * This method should not be used
     * @param serviceName string name of the service
     * @param port port on which to run this server
     * @param tags comma separate tags
     * @returns `Promise<ServiceAlias>`
     */
    PathFinder.prototype.registerAlias = function (serviceName, port) {
        var tags = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            tags[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var alias;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alias = new (ServiceAlias_1.default.bind.apply(ServiceAlias_1.default, __spreadArray([void 0, serviceName, port], tags)))();
                        this.aliases.add(alias);
                        return [4 /*yield*/, alias.register()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(alias)];
                }
            });
        });
    };
    /**
     * Method to get the gRPC communication channel to other service
     * @param param0 Object of type `GetClietnRequest`
     * @returns `Promise<ServiceClient>`
     */
    PathFinder.prototype.getClient = function (_a) {
        var serviceNameInProto = _a.serviceNameInProto, serviceName = _a.serviceName, tag = _a.tag, options = _a.options;
        return PFClientProvider_1.default.getInstance().getClient({
            serviceNameInProto: serviceNameInProto,
            serviceName: serviceName,
            tag: tag,
            options: options,
        });
    };
    PathFinder.VERSION = "1.0.0";
    return PathFinder;
}());
exports.default = PathFinder;
__exportStar(require("./grpc/PFServer"), exports);
__exportStar(require("./logging/Logger"), exports);
__exportStar(require("./logging/LoggerMiddleware"), exports);
__exportStar(require("./zookeeper"), exports);
