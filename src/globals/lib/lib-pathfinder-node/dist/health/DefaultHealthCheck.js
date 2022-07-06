"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultHealthCheck = void 0;
var HealthCheckResult_1 = __importDefault(require("./HealthCheckResult"));
var DefaultHealthCheck = /** @class */ (function () {
    function DefaultHealthCheck() {
    }
    DefaultHealthCheck.prototype.getIdentifier = function () {
        return "DEFAULT";
    };
    DefaultHealthCheck.prototype.check = function () {
        return HealthCheckResult_1.default.SUCCESS;
    };
    return DefaultHealthCheck;
}());
exports.DefaultHealthCheck = DefaultHealthCheck;
exports.default = DefaultHealthCheck;
