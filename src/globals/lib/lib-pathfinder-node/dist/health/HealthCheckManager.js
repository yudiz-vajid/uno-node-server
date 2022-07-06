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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckManager = void 0;
var Logger_1 = __importDefault(require("../logging/Logger"));
var DefaultHealthCheck_1 = __importDefault(require("./DefaultHealthCheck"));
var HealthCheckResult_1 = __importStar(require("./HealthCheckResult"));
var HealthCheckManager = /** @class */ (function () {
    function HealthCheckManager() {
        this.checksMap = new Map();
        this.addChecks(undefined, [new DefaultHealthCheck_1.default()]);
    }
    HealthCheckManager.getInstance = function () {
        if (this.instance == null || this.instance === undefined) {
            this.instance = new HealthCheckManager();
        }
        return this.instance;
    };
    HealthCheckManager.prototype.addChecks = function (serviceName, checks) {
        if (!checks || checks.length === 0)
            return;
        if (!serviceName) {
            serviceName = HealthCheckManager.ID_SERVER_CHECKS;
        }
        var checkSet;
        if (this.checksMap.has(serviceName)) {
            checkSet = this.checksMap.get(serviceName);
        }
        else {
            checkSet = new Set();
        }
        if (checkSet === undefined) {
            checkSet = new Set();
        }
        for (var i = 0; i < checks.length; i++) {
            checkSet.add(checks[i]);
        }
        this.checksMap.set(serviceName, checkSet);
    };
    HealthCheckManager.prototype.runChecks = function (serviceName) {
        if (!serviceName || serviceName === "") {
            serviceName = HealthCheckManager.ID_SERVER_CHECKS;
        }
        var checks = this.checksMap.get(serviceName);
        if (checks === undefined) {
            Logger_1.default.warn("no health check registered for: ", serviceName);
            return HealthCheckResult_1.default.SUCCESS;
        }
        var hcs = checks.values();
        for (var i = 0; i < checks.size; i++) {
            var hc = hcs.next().value;
            try {
                var result = hc.check();
                Logger_1.default.info("HealthCheck: ", serviceName, "/", hc.getIdentifier(), " Result: ", result.toString());
                if (result.status !== HealthCheckResult_1.HealthCheckStatus.OK) {
                    Logger_1.default.info("HealthCheck: ", serviceName, "/", hc.getIdentifier(), "FAILED. Result: ", result.toString());
                    return result;
                }
            }
            catch (e) {
                Logger_1.default.error("HealthCheck: ", serviceName, "/", hc.getIdentifier(), "EXCEPTION. Error: ", e);
                return HealthCheckResult_1.default.ERROR;
            }
        }
        return HealthCheckResult_1.default.SUCCESS;
    };
    HealthCheckManager.ID_SERVER_CHECKS = "SPL_SERVER";
    return HealthCheckManager;
}());
exports.HealthCheckManager = HealthCheckManager;
exports.default = HealthCheckManager;
