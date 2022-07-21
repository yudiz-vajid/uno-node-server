"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.PFClientProvider = void 0;
var grpc_js_1 = require("@grpc/grpc-js");
var proto_loader_1 = require("@grpc/proto-loader");
var PFNameResolver_1 = __importDefault(require("./PFNameResolver"));
var grpc_inspect_1 = __importDefault(require("grpc-inspect"));
var grpc_promise_1 = __importDefault(require("grpc-promise"));
var Logger_1 = __importDefault(require("../logging/Logger"));
var UUID_1 = __importDefault(require("../utils/UUID"));
var constants_1 = require("@grpc/grpc-js/build/src/constants");
var PFClientProvider = /** @class */ (function () {
    function PFClientProvider(promisify) {
        this.protoMap = new Map();
        this.promisify = promisify || false;
        this.protos = new Map();
        this.asyncProtoMap = new Map();
    }
    PFClientProvider.getInstance = function () {
        return this.instance;
    };
    PFClientProvider.initialize = function (promisify) {
        if (this.instance)
            return;
        this.instance = new PFClientProvider(promisify);
    };
    PFClientProvider.prototype.loadProtos = function (protos, loadOpts, disableProtoSyncLoading) {
        var _this = this;
        this.loadOpts = loadOpts;
        protos.forEach(function (proto) {
            _this.protos.set(proto.name, proto);
        });
        if (!disableProtoSyncLoading) {
            Logger_1.default.info("Loading Protos synchronously.");
            protos.forEach(function (proto) {
                _this.loadProtoForService(proto.name);
            });
            Logger_1.default.info("SYNC: All Protos loaded successfully for usage.");
        }
        // else {
        //   const startTime = Date.now();
        //   Logger.debug("Loading Protos asynchronously.");
        //   this.startAsyncLoading()
        //     .then((_) => {
        //       Logger.info(
        //         "ASYNC: All Protos loaded successfully for usage. Time taken: ",
        //         (Date.now() - startTime) / 1000
        //       );
        //     })
        //     .catch((e) => {
        //       Logger.error(`Error while loading protos async: `, e);
        //       Logger.info("Time taken: ", (Date.now() - startTime) / 1000);
        //     });
        // }
    };
    PFClientProvider.prototype.startAsyncLoading = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, prArr;
            var _this = this;
            return __generator(this, function (_a) {
                startTime = Date.now();
                prArr = [];
                this.protos.forEach(function (proto) {
                    var protoPromise = _this.loadProtoForServiceAsync(proto.name);
                    _this.asyncProtoMap.set(proto.name, protoPromise);
                    prArr.push(protoPromise);
                });
                return [2 /*return*/, Promise.all(prArr)
                        .then(function (_) {
                        Logger_1.default.info("ASYNC: All Protos loaded successfully for usage. Time taken: ", (Date.now() - startTime) / 1000);
                    })
                        .catch(function (e) {
                        Logger_1.default.error("Error while loading protos async: ", e);
                        Logger_1.default.info("Time taken: ", (Date.now() - startTime) / 1000);
                    })];
            });
        });
    };
    PFClientProvider.prototype.loadProtoForServiceAsync = function (serviceName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            return resolve(_this.loadProtoForService(serviceName, true));
                        }
                        catch (e) {
                            Logger_1.default.error("Error while loading proto for service: " + serviceName, e);
                            return reject(e);
                        }
                    })];
            });
        });
    };
    PFClientProvider.prototype.loadProtoForService = function (serviceName, isAsync) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, intTime, proto, packageDef, _a, protoDescriptor, descriptor;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        startTime = Date.now();
                        intTime = Date.now();
                        if (this.protoMap.get(serviceName) !== undefined)
                            return [2 /*return*/];
                        proto = this.protos.get(serviceName);
                        Logger_1.default.debug("Starting loading of proto for: ", serviceName);
                        if (!proto)
                            throw new Error("Supply proto information first before loading the same for service: " +
                                serviceName);
                        if (!isAsync) return [3 /*break*/, 2];
                        return [4 /*yield*/, proto_loader_1.load(proto.path, __assign({ longs: Number, enums: String, defaults: true, oneofs: true }, this.loadOpts))];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = proto_loader_1.loadSync(proto.path, __assign({ longs: Number, enums: String, defaults: true, oneofs: true }, this.loadOpts));
                        _b.label = 3;
                    case 3:
                        packageDef = _a;
                        Logger_1.default.debug("Loading done in: ", serviceName, Date.now() - intTime);
                        intTime = Date.now();
                        protoDescriptor = grpc_js_1.loadPackageDefinition(packageDef);
                        Logger_1.default.debug("Package definition loaded in : ", serviceName, Date.now() - intTime);
                        intTime = Date.now();
                        descriptor = grpc_inspect_1.default(protoDescriptor);
                        Logger_1.default.debug("Inspection done in : ", serviceName, Date.now() - intTime);
                        intTime = Date.now();
                        this.protoMap.set(proto.name, descriptor);
                        Logger_1.default.debug("Map updated in : ", serviceName, Date.now() - intTime);
                        Logger_1.default.debug("Time taken to load proto: ", proto.name, " is ", (Date.now() - startTime) / 1000);
                        return [2 /*return*/, descriptor];
                }
            });
        });
    };
    PFClientProvider.prototype.getProtoDescriptor = function (serviceName) {
        return __awaiter(this, void 0, void 0, function () {
            var descriptor;
            return __generator(this, function (_a) {
                descriptor = this.protoMap.get(serviceName);
                if (descriptor)
                    return [2 /*return*/, descriptor];
                if (this.asyncProtoMap.has(serviceName)) {
                    return [2 /*return*/, this.asyncProtoMap.get(serviceName)];
                }
                if (this.protos.has(serviceName)) {
                    return [2 /*return*/, this.loadProtoForService(serviceName)];
                }
                throw new Error("Supply proto information first before loading the same for service: " +
                    serviceName);
            });
        });
    };
    PFClientProvider.prototype.getPrettyMethodName = function (path) {
        return path ? path.split("/").pop() : "unkown";
    };
    PFClientProvider.prototype.getClient = function (_a) {
        var serviceNameInProto = _a.serviceNameInProto, serviceName = _a.serviceName, tag = _a.tag, options = _a.options;
        return __awaiter(this, void 0, void 0, function () {
            var url_1, descriptor, Ctor, interceptors, client, meta, key, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, PFNameResolver_1.default.getInstance().getUrl(serviceName, tag)];
                    case 1:
                        url_1 = _b.sent();
                        return [4 /*yield*/, this.getProtoDescriptor(serviceName)];
                    case 2:
                        descriptor = _b.sent();
                        Ctor = descriptor.client(serviceNameInProto);
                        interceptors = [
                            function (options, nextCall) {
                                // this is my lex scope
                                var startTime = 0;
                                var isEndLogged = false;
                                Logger_1.default.info(options.method_definition);
                                var methodName = _this.getPrettyMethodName(options.method_definition.path);
                                var internalRequestId = UUID_1.default.getUUID().replace(/-/g, "");
                                return new grpc_js_1.InterceptingCall(nextCall(options), {
                                    // TODO: Update interceptors for tracing and metrics
                                    start: function (metadata, listener, next) {
                                        var mListener = {
                                            onReceiveMetadata: function (metadata) {
                                                listener.onReceiveMetadata(metadata);
                                            },
                                            onReceiveMessage: function (message) {
                                                if (!isEndLogged) {
                                                    Logger_1.default.info("GRPC_RESPONSE: ", internalRequestId, url_1, serviceName, methodName, Date.now() - startTime, message);
                                                }
                                                listener.onReceiveMessage(message);
                                            },
                                            onReceiveStatus: function (status) {
                                                if (status.code !== constants_1.Status.OK) {
                                                    Logger_1.default.error("GRPC_COMPLETE WITH ERROR: ", internalRequestId, url_1, serviceName, methodName, status.code, status.details);
                                                }
                                                else {
                                                    Logger_1.default.info("GRPC_COMPLETE WITH SUCCESS: ", internalRequestId, url_1, serviceName, methodName);
                                                }
                                                listener.onReceiveStatus(status);
                                            },
                                        };
                                        next(metadata, mListener);
                                    },
                                    sendMessage: function (message, next) {
                                        startTime = Date.now();
                                        Logger_1.default.info("GRPC_REQUEST: ", internalRequestId, url_1, serviceName, methodName, message);
                                        next(message);
                                    },
                                    cancel: function (next) {
                                        Logger_1.default.info("GRPC_COMPLETE WITH CANCEL: ", internalRequestId, url_1, serviceName, methodName, Date.now() - startTime);
                                        isEndLogged = true;
                                        next();
                                    },
                                    halfClose: function (next) {
                                        try {
                                            next();
                                        }
                                        catch (e) {
                                            Logger_1.default.info("GRPC_HALF_CLOSE WITH ERROR: ", internalRequestId, url_1, serviceName, methodName, Date.now() - startTime, e);
                                            isEndLogged = true;
                                            throw e;
                                        }
                                    },
                                });
                            },
                        ];
                        client = new Ctor(url_1, grpc_js_1.credentials.createInsecure(), {
                            interceptors: interceptors,
                        });
                        meta = new grpc_js_1.Metadata();
                        if (options && options.meta) {
                            for (key in options.meta) {
                                meta.add(key, options.meta[key]);
                            }
                        }
                        if (this.promisify) {
                            grpc_promise_1.default.promisifyAll(client, {
                                metadata: meta,
                                timeout: options && options.timeout ? options.timeout : 5000,
                            });
                        }
                        return [2 /*return*/, Promise.resolve(client)];
                    case 3:
                        e_1 = _b.sent();
                        Logger_1.default.error(e_1);
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return PFClientProvider;
}());
exports.PFClientProvider = PFClientProvider;
exports.default = PFClientProvider;
