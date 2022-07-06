"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportGrpcMapping = exports.LogLevelsGrpcMapping = exports.Transports = exports.TransportNames = exports.LogLevel = exports.LogLevelKeys = exports.LogLevels = void 0;
exports.LogLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};
exports.LogLevelKeys = {
    ERROR: "error",
    WARN: "warn",
    INFO: "info",
    DEBUG: "debug",
};
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.TransportNames = {
    CONSOLE: "console",
    FILE: "file",
};
var Transports;
(function (Transports) {
    Transports["CONSOLE"] = "CONSOLE";
    Transports["FILE"] = "FILE";
})(Transports = exports.Transports || (exports.Transports = {}));
exports.LogLevelsGrpcMapping = (_a = {},
    _a[exports.LogLevelKeys.ERROR] = LogLevel.ERROR,
    _a[exports.LogLevelKeys.INFO] = LogLevel.INFO,
    _a[exports.LogLevelKeys.WARN] = LogLevel.WARN,
    _a[exports.LogLevelKeys.DEBUG] = LogLevel.DEBUG,
    _a);
exports.TransportGrpcMapping = (_b = {},
    _b[exports.TransportNames.CONSOLE] = Transports.CONSOLE,
    _b[exports.TransportNames.FILE] = Transports.FILE,
    _b);
