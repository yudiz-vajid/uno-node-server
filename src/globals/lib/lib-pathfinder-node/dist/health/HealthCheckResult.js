"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckResult = exports.HealthCheckStatus = void 0;
var HealthCheckStatus;
(function (HealthCheckStatus) {
    HealthCheckStatus["OK"] = "OK";
    HealthCheckStatus["ERROR"] = "ERROR";
    HealthCheckStatus["FAILED"] = "FAILED";
    HealthCheckStatus["UNKNOWN"] = "UNKNOWN";
})(HealthCheckStatus = exports.HealthCheckStatus || (exports.HealthCheckStatus = {}));
var HealthCheckResult = /** @class */ (function () {
    function HealthCheckResult(status, message) {
        this._status = status;
        this._message = message || status;
    }
    Object.defineProperty(HealthCheckResult.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (status) {
            this._status = status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HealthCheckResult.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (message) {
            this._message = message;
        },
        enumerable: false,
        configurable: true
    });
    HealthCheckResult.prototype.toString = function () {
        return "{\"status\":\"" + this.status + "\", \"message\":\"" + this.message + "\"}";
    };
    HealthCheckResult.ERROR = new HealthCheckResult(HealthCheckStatus.ERROR);
    HealthCheckResult.SUCCESS = new HealthCheckResult(HealthCheckStatus.OK);
    return HealthCheckResult;
}());
exports.HealthCheckResult = HealthCheckResult;
exports.default = HealthCheckResult;
