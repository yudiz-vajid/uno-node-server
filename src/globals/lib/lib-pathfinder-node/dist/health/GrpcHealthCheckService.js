"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcHealthCheckService = void 0;
var HealthCheckManager_1 = __importDefault(require("./HealthCheckManager"));
var HealthCheckResult_1 = require("./HealthCheckResult");
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus[ServiceStatus["UNKNOWN"] = 0] = "UNKNOWN";
    ServiceStatus[ServiceStatus["SERVING"] = 1] = "SERVING";
    ServiceStatus[ServiceStatus["NOT_SERVING"] = 2] = "NOT_SERVING";
    ServiceStatus[ServiceStatus["SERVICE_UNKNOWN"] = 3] = "SERVICE_UNKNOWN";
})(ServiceStatus || (ServiceStatus = {}));
var GrpcHealthCheckService = /** @class */ (function () {
    function GrpcHealthCheckService() {
    }
    GrpcHealthCheckService.prototype.check = function (call, callback) {
        var result = HealthCheckManager_1.default.getInstance().runChecks(call.request.service);
        var grpcResult = result.status === HealthCheckResult_1.HealthCheckStatus.OK
            ? ServiceStatus.SERVING
            : ServiceStatus.NOT_SERVING;
        return callback(null, { status: grpcResult });
    };
    return GrpcHealthCheckService;
}());
exports.GrpcHealthCheckService = GrpcHealthCheckService;
exports.default = GrpcHealthCheckService;
