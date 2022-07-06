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
var __1 = __importStar(require(".."));
var PFNameResolver_1 = __importDefault(require("../grpc/PFNameResolver"));
var constants_1 = require("../utils/constants");
var SharedObjects_1 = __importDefault(require("../utils/SharedObjects"));
var protos = [
    {
        path: __dirname + "../../protos/HelloService.proto",
        name: "service-game-developer-dashboard",
    },
    {
        path: __dirname + "../../protos/GreeterService.proto",
        name: "service-partner",
    },
];
var isPromisified = false;
__1.default.initialize({
    appName: "service-test",
    protosToLoad: protos,
    promisify: isPromisified,
});
var client = SharedObjects_1.default.getInstance().getConsulClient();
function serviceRegister() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.agent.service.register({
                        id: "1",
                        name: "dummy-service",
                        address: "127.0.0.1",
                        port: 3001,
                        tags: [constants_1.TAG_DEFAULT],
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.agent.service.register({
                            id: "2",
                            name: "dummy-service",
                            address: "127.0.0.1",
                            port: 3002,
                            tags: [constants_1.TAG_DEFAULT],
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.agent.service.register({
                            id: "3",
                            name: "dummy-service-2",
                            address: "127.0.0.1",
                            port: 3003,
                            tags: [constants_1.TAG_DEFAULT],
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, client.agent.service.register({
                            id: "4",
                            name: "dummy-service-2",
                            address: "127.0.0.1",
                            port: 3004,
                            tags: [constants_1.TAG_DEFAULT],
                        })];
                case 4:
                    _a.sent();
                    // await PathFinder.getInstance().registerAlias(
                    //   "service-game-developer-dashboard",
                    //   3000,
                    //   TAG_DEFAULT,
                    //   "alpha"
                    // );
                    // await PathFinder.getInstance().registerAlias(
                    //   "service-partner",
                    //   3001,
                    //   TAG_DEFAULT,
                    //   "beta"
                    // );
                    // await PathFinder.getInstance().registerAlias(
                    //   "dummy-service",
                    //   3002,
                    //   TAG_DEFAULT,
                    //   "gama"
                    // );
                    // await PathFinder.getInstance().registerAlias(
                    //   "dummy-service-2",
                    //   3004,
                    //   TAG_DEFAULT,
                    //   "gama"
                    // );
                    // await PathFinder.getInstance().registerAlias(
                    //   "dummy-service-20",
                    //   3005,
                    //   TAG_DEFAULT,
                    //   "gama"
                    // );
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("DEREGISTERING");
                                    return [4 /*yield*/, client.agent.service.deregister({
                                            id: "1",
                                        })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, client.agent.service.deregister({
                                            id: "2",
                                        })];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, client.agent.service.deregister({
                                            id: "3",
                                        })];
                                case 3:
                                    _a.sent();
                                    console.log("DEREGISTERING: DONE-2");
                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.log("REREGISTERING");
                                                    return [4 /*yield*/, client.agent.service.register({
                                                            id: "11",
                                                            name: "dummy-service",
                                                            address: "127.0.0.1",
                                                            port: 3011,
                                                            tags: [constants_1.TAG_DEFAULT],
                                                        })];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, client.agent.service.register({
                                                            id: "12",
                                                            name: "dummy-service",
                                                            address: "127.0.0.1",
                                                            port: 3012,
                                                            tags: [constants_1.TAG_DEFAULT],
                                                        })];
                                                case 2:
                                                    _a.sent();
                                                    console.log("REREGISTERING: DONE");
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, 14000);
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 10000);
                    return [2 /*return*/];
            }
        });
    });
}
process.on("unhandledRejection", function (e) {
    console.error("ERROR: ", e);
});
var timeout;
var count = 0;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("<-------- main -- " + count + 1 + " ----------->");
            // const instance = PathFinder.getInstance();
            __1.default.getInstance()
                .getServerUrl("dummy-service")
                .then(function (url) {
                console.log("dummy-service: ", url);
            });
            // console.log(instance === PathFinder.getInstance());
            __1.default.getInstance()
                .getServerUrl("dummy-service")
                .then(function (url) {
                console.log("dummy-service: ", url);
            });
            __1.default.getInstance()
                .getServerUrl("dummy-service")
                .then(function (url) {
                console.log("dummy-service: ", url);
            });
            __1.default.getInstance()
                .getServerUrl("dummy-service")
                .then(function (url) {
                console.log("dummy-service: ", url);
            });
            __1.default.getInstance()
                .getServerUrl("dummy-service-2")
                .then(function (url) {
                console.log("dummy-service-2: ", url);
            });
            __1.default.getInstance()
                .getServerUrl("dummy-service-2")
                .then(function (url) {
                console.log("dummy-service-2: ", url);
            });
            __1.default.getInstance()
                .getServerUrl("dummy-service-2")
                .then(function (url) {
                console.log("dummy-service-2: ", url);
            });
            __1.default.getInstance()
                .getServerUrl("dummy-service-2")
                .then(function (url) {
                console.log("dummy-service-2: ", url);
            });
            // try {
            //   let str52 = await PathFinder.getInstance().getServerUrl("dummy-service-4");
            //   console.log(str52);
            // } catch (e) {
            //   console.error(e);
            // }
            timeout = setTimeout(function () {
                count += 1;
                main();
            }, 10000);
            if (count === 5) {
                clearTimeout(timeout);
                PFNameResolver_1.default.getInstance().clearWatch("dummy-service-2", constants_1.TAG_DEFAULT);
            }
            return [2 /*return*/];
        });
    });
}
console.time("Main");
function main2() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serviceRegister()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, main()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main2();
var t;
function protoLoadCheck() {
    return __awaiter(this, void 0, void 0, function () {
        var partnerClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.default.getInstance().getClient({
                        serviceName: "service-partner",
                        serviceNameInProto: "PartnerService",
                    })];
                case 1:
                    partnerClient = _a.sent();
                    console.log("PARTNER CLIENT: ", partnerClient);
                    // partnerClient.forgotPwd(
                    //   { email: "pranjuls@mplgaming.com" },
                    //   (err: Error, res: any) => {
                    //     console.log("Parnter srvice method call");
                    //     if (err) {
                    //       console.error(err);
                    //     } else {
                    //       console.log(res);
                    //     }
                    //   }
                    // );
                    if (isPromisified) {
                        console.log("PRomisified");
                        partnerClient
                            .forgotPwd()
                            .sendMessage({ email: "pranjuls+1@mplgaming.com" })
                            .then(function (d) { return console.log(d); })
                            .catch(function (e) { return console.error(e); });
                    }
                    else {
                        console.log("Non PRomisified");
                        partnerClient.forgotPwd({ email: "pranjuls@mplgaming.com" }, function (err, res) {
                            console.log("Parnter srvice method call");
                            if (err) {
                                console.error(err);
                            }
                            else {
                                console.log(res);
                            }
                        });
                    }
                    // .then((data: any) => {
                    //   console.log("DATA:", data);
                    // })
                    // .error((e: Error) => {
                    //   console.error("ERROR IN PROMISIFIED: ", e);
                    // });
                    t = setTimeout(function () { }, 10000);
                    return [2 /*return*/];
            }
        });
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protoLoadCheck()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// test();
process.on("exit", function () {
    clearTimeout(t);
});
function testLogger() {
    return __awaiter(this, void 0, void 0, function () {
        var url, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    __1.Logger.error("sadasd", { dasdsa: "asdsad" });
                    __1.Logger.warn("sadasd", { dasdsa: "asdsad" });
                    __1.Logger.info("sadasd", "name", { dasdsa: "asdsad" });
                    __1.Logger.error("Error is : ", new Error("SOMETHING IS WRONG"));
                    __1.Logger.debug("sadasd", true, 10, 10.323, function () { }, { dasdsa: "aasdasdsdsad" }, { dasdsa: "aasdassdsad" }, { dasdsa: "asdsasdsad" }, "adsadsdas");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, __1.default.getInstance().getServerUrl("service-1")];
                case 2:
                    url = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    __1.Logger.error("error", e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
testLogger();
console.timeEnd("Main");
