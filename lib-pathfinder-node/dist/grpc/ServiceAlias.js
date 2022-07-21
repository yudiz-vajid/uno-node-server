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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SharedObjects_1 = __importDefault(require("../utils/SharedObjects"));
var index_1 = __importDefault(require("../index"));
var UUID_1 = __importDefault(require("../utils/UUID"));
/**
 * @deprecated - even before first release
 */
var ServiceAlias = /** @class */ (function () {
    function ServiceAlias(name, port) {
        var tags = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            tags[_i - 2] = arguments[_i];
        }
        this.PFV_TAG = "PFv" + index_1.default.VERSION;
        this.name = name.toLowerCase();
        this.port = port;
        if (tags) {
            this.tags = new Set(__spreadArray(__spreadArray([], tags), [this.PFV_TAG, "alias"]));
        }
        else {
            this.tags = new Set([this.PFV_TAG, "alias"]);
        }
        this.id = UUID_1.default.getUUID().replace(/-/g, "");
        this.isRegistered = false;
        // TODO: Implement shutdown manager
    }
    ServiceAlias.prototype.register = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isRegistered)
                            return [2 /*return*/];
                        this.isRegistered = true;
                        return [4 /*yield*/, this.consulRegister()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServiceAlias.prototype.deregister = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isRegistered)
                            return [2 /*return*/];
                        this.isRegistered = false;
                        return [4 /*yield*/, this.consulDeregister()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServiceAlias.prototype.consulRegister = function () {
        return __awaiter(this, void 0, void 0, function () {
            var meta, check, service, consulClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        meta = new Map();
                        meta.set("pf_version", index_1.default.VERSION);
                        check = {
                            interval: "20s",
                            deregistercriticalserviceafter: "120s",
                            grpc: "127.0.0.1:" + this.port,
                            grpcusetls: false,
                            timeout: "60s",
                        };
                        service = {
                            id: this.id,
                            name: this.name,
                            tags: Array.from(this.tags),
                            port: this.port,
                            check: check,
                            meta: meta,
                        };
                        consulClient = SharedObjects_1.default.getInstance().getConsulClient();
                        return [4 /*yield*/, consulClient.agent.service.register(service)];
                    case 1:
                        _a.sent();
                        this.isRegistered = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    ServiceAlias.prototype.consulDeregister = function () {
        return __awaiter(this, void 0, void 0, function () {
            var consulClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consulClient = SharedObjects_1.default.getInstance().getConsulClient();
                        return [4 /*yield*/, consulClient.agent.service.deregister(this.id)];
                    case 1:
                        _a.sent();
                        this.isRegistered = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    return ServiceAlias;
}());
exports.default = ServiceAlias;
