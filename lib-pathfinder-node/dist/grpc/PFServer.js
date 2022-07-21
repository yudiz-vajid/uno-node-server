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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PFServer = void 0;
var grpc_js_1 = require("@grpc/grpc-js");
var proto_loader_1 = require("@grpc/proto-loader");
var grpc_inspect_1 = __importDefault(require("grpc-inspect"));
var constants_1 = require("../utils/constants");
var index_1 = __importDefault(require("../index"));
var SharedObjects_1 = __importDefault(require("../utils/SharedObjects"));
var ShutdownManager_1 = __importDefault(require("../utils/ShutdownManager"));
var UUID_1 = __importDefault(require("../utils/UUID"));
var GrpcHealthCheckService_1 = __importDefault(require("../health/GrpcHealthCheckService"));
var path_1 = __importDefault(require("path"));
var Logger_1 = __importDefault(require("../logging/Logger"));
var PFServer = /** @class */ (function () {
    function PFServer(serviceGroupName, port) {
        var tags = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            tags[_i - 2] = arguments[_i];
        }
        this.PFV_TAG = "PFv" + index_1.default.VERSION;
        this.server = new grpc_js_1.Server();
        this.serviceGroupName = serviceGroupName;
        this.port = port;
        this.isLocalDev = constants_1.isRunningLocally();
        if (tags) {
            this.tags = new Set(__spreadArray([], tags));
        }
        else {
            this.tags = new Set();
        }
        this.tags.add(this.PFV_TAG);
        this.isRegistered = false;
        this.id = UUID_1.default.getUUID().replace(/-/g, "");
        var protoDescriptor = this.loadProto(__dirname + "../../protos/HealthCheckService.proto").protoDescriptor;
        // @ts-ignore
        var hcService = 
        // @ts-ignore
        protoDescriptor.grpc.health.v1.Health;
        var ghcService = new GrpcHealthCheckService_1.default();
        this.server.addService(hcService.service, {
            check: ghcService.check,
        });
        // const {} = this.loadProto;
        this.addService(__dirname + "../../protos/ManageLoggerService.proto", path_1.default.join(__dirname, "../logging/GrpcManageLoggerService.js"));
        //
        // this.server.addService(new Gr)
        ShutdownManager_1.default.getInstance().addShutdownListener(this);
    }
    PFServer.prototype.loadProto = function (pathToProto, loadOptions) {
        var packageDef = proto_loader_1.loadSync(pathToProto, __assign({ longs: Number, enums: String, defaults: true, oneofs: true }, loadOptions));
        var protoDescriptor = grpc_js_1.loadPackageDefinition(packageDef);
        var descriptor = grpc_inspect_1.default(protoDescriptor);
        return { protoDescriptor: protoDescriptor, descriptor: descriptor };
    };
    PFServer.prototype.addService = function (pathToProto, pathToMethodExporterFile, loadOptions) {
        // Proto loading setup
        var _a = this.loadProto(pathToProto, loadOptions), descriptor = _a.descriptor, protoDescriptor = _a.protoDescriptor;
        var namespaces = descriptor.namespaceNames();
        var methods = require(pathToMethodExporterFile);
        if (namespaces.length > 0) {
            for (var i = 0; i < namespaces.length; i++) {
                var namespace = namespaces[i];
                this.checkAndAddService(protoDescriptor, descriptor, methods, namespace);
            }
        }
        else {
            Logger_1.default.warn("No name space specified in the supplied proto");
            this.checkAndAddService(protoDescriptor, descriptor, methods);
        }
        return this;
    };
    PFServer.prototype.checkAndAddService = function (protoDescriptor, descriptor, methods, namespace) {
        var services = descriptor.serviceNames(namespace);
        if (services.length > 0) {
            for (var j = 0; j < services.length; j++) {
                var service = services[j];
                var methodNames = descriptor.methodNames(service);
                var serviceMethodsImpl = {};
                var missingMethodImpls = [];
                for (var k = 0; k < methodNames.length; k++) {
                    var methodName = methodNames[k];
                    if (methods.hasOwnProperty(methodName)) {
                        serviceMethodsImpl[methodName] = methods[methodName];
                    }
                    else {
                        missingMethodImpls.push(methodName);
                    }
                }
                if (Object.keys(serviceMethodsImpl).length) {
                    var parts = [namespace];
                    if (namespace && namespace.indexOf(".") > 0) {
                        parts = namespace.split(".");
                    }
                    var n = protoDescriptor;
                    if (namespace) {
                        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                            var part = parts_1[_i];
                            // @ts-ignore
                            n = n[part];
                        }
                    }
                    // @ts-ignore
                    var s = n[service];
                    this.server.addService(s.service, serviceMethodsImpl);
                }
                else {
                    Logger_1.default.warn("No method available to register with the server for service: ", service);
                }
                if (missingMethodImpls.length > 0) {
                    Logger_1.default.warn("We are missing some of the methods in implementation. please check the list below for service: ", service);
                    Logger_1.default.warn(Array(missingMethodImpls).toString());
                }
            }
        }
        else {
            Logger_1.default.info("No service found in the namespace:", namespace);
        }
    };
    PFServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pr;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pr = new Promise(function (resolve, reject) {
                            _this.server.bindAsync("0.0.0.0:" + _this.port, grpc_js_1.ServerCredentials.createInsecure(), function (err, port) {
                                if (err) {
                                    return reject(err);
                                }
                                else {
                                    _this.server.start();
                                }
                                Logger_1.default.info("Server is started on port: ", port);
                                return resolve(true);
                            });
                        });
                        return [4 /*yield*/, pr];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.consulRegister()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    PFServer.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.consulDeregister()];
                    case 1:
                        _a.sent();
                        this.server.tryShutdown(function (error) {
                            if (error) {
                                Logger_1.default.error("server error while shutting down: ", error);
                                _this.server.forceShutdown();
                            }
                        });
                        return [2 /*return*/, this];
                }
            });
        });
    };
    PFServer.prototype.shutdownNow = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.consulDeregister()];
                    case 1:
                        _a.sent();
                        this.server.forceShutdown();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    PFServer.prototype.consulRegister = function () {
        return __awaiter(this, void 0, void 0, function () {
            var meta, check, service, consulClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isRegistered || this.isLocalDev)
                            return [2 /*return*/];
                        meta = new Map();
                        meta.set("pf_version", index_1.default.VERSION);
                        check = {
                            interval: "10s",
                            deregistercriticalserviceafter: "120s",
                            grpc: "127.0.0.1:" + this.port,
                            grpcusetls: false,
                            timeout: "60s",
                        };
                        service = {
                            id: this.id,
                            name: this.serviceGroupName,
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
    PFServer.prototype.beforeShutdown = function () {
        this.consulDeregister();
        this.shutdown();
        return 5000; // TODO: GET FROM CONFIG - ALSO MENTION KILL_TIMEOUT in PM2
    };
    PFServer.prototype.afterShutdown = function () {
        this.shutdownNow();
    };
    PFServer.prototype.consulDeregister = function () {
        return __awaiter(this, void 0, void 0, function () {
            var consulClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isRegistered || this.isLocalDev)
                            return [2 /*return*/];
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
    return PFServer;
}());
exports.PFServer = PFServer;
exports.default = PFServer;
