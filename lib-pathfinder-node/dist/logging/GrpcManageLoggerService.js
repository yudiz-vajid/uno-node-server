"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __importDefault(require("./Logger"));
var GrpcManageLoggerService = /** @class */ (function () {
    function GrpcManageLoggerService() {
    }
    GrpcManageLoggerService.getInstance = function () {
        if (!this.instance)
            this.instance = new GrpcManageLoggerService();
        return this.instance;
    };
    GrpcManageLoggerService.prototype.checkCurrentLevels = function (_, callback) {
        return callback(null, Logger_1.default.checkCurrentLevels());
    };
    GrpcManageLoggerService.prototype.setCurrentLevels = function (call, callback) {
        return callback(null, Logger_1.default.setCurrentLevels("grpc", call.request));
    };
    GrpcManageLoggerService.prototype.checkFileLogLevelStatus = function (_, callback) {
        return callback(null, Logger_1.default.checkFileLogLevelStatus());
    };
    GrpcManageLoggerService.prototype.updateFileLogLevelStatus = function (call, callback) {
        return callback(null, Logger_1.default.updateFileLogLevelStatus(call.request));
    };
    GrpcManageLoggerService.prototype.checkLogLevels = function (_, callback) {
        return callback(null, Logger_1.default.printLogs());
    };
    return GrpcManageLoggerService;
}());
var service = GrpcManageLoggerService.getInstance();
module.exports = {
    checkCurrentLevels: service.checkCurrentLevels,
    setCurrentLevels: service.setCurrentLevels,
    checkFileLogLevelStatus: service.checkFileLogLevelStatus,
    updateFileLogLevelStatus: service.updateFileLogLevelStatus,
    checkLogLevels: service.checkLogLevels,
};
