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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var LoggerUtils_1 = require("../utils/LoggerUtils");
var winston_1 = require("winston");
var LoggerTypes_1 = require("./LoggerTypes");
var constants_1 = require("../utils/constants");
var combine = winston_1.format.combine, label = winston_1.format.label, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.getLogFormat = function (labelText) {
        return combine(label({
            label: labelText,
        }), timestamp(), 
        // this.buildErrorLogIfAny()(),
        this.customLogFormat());
    };
    Logger.customLogFormat = function () {
        return printf(function (_a) {
            var level = _a.level, message = _a.message, timestamp = _a.timestamp, label = _a.label;
            return label + " " + timestamp + " [" + level + "]:: " + (level === "error" ? LoggerUtils_1.getErrorString(message) : message);
        });
    };
    // private static buildErrorLogIfAny() {
    //   return format((info) => {
    //     if (info && info.message && info.message instanceof Error) {
    //       Object.assign(
    //         {
    //           message: info.message.message,
    //           stack: info.message.stack,
    //         },
    //         info
    //       );
    //     }
    //     if (info && info instanceof Error) {
    //       return Object.assign(
    //         {
    //           message: info.message,
    //           stack: info.stack,
    //         },
    //         info
    //       );
    //     }
    //     return info;
    //   });
    // }
    Logger.initializeFileTransport = function () {
        if (constants_1.isRunningLocally()) {
            return false;
        }
        this.transportFile = new winston_1.transports.File({
            dirname: "" + (process.env.NODE_ENV !== "production" ? "" : "/var/log/mpl/"),
            filename: this.serviceLabel.startsWith("service")
                ? this.serviceLabel + ".log"
                : "service-" + this.serviceLabel + ".log",
            tailable: true,
        });
        this.transportFile.name = LoggerTypes_1.TransportNames.FILE;
        return true;
    };
    Logger.initialize = function (label, options) {
        this.serviceLabel = label;
        this.transportConsole = new winston_1.transports.Console({
            level: "debug",
        });
        this.transportConsole.name = LoggerTypes_1.TransportNames.CONSOLE;
        label = label.toLowerCase().replace(/[ ]+/g, "-");
        this.logger = winston_1.createLogger(__assign(__assign({}, options), { exitOnError: false, format: this.getLogFormat(label), transports: [this.transportConsole] }));
        var success = this.initializeFileTransport();
        if (success) {
            this.logger.add(this.transportFile);
        }
    };
    Logger.warn = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        this.logger.warn(LoggerUtils_1.formatLogMessages(messages));
    };
    Logger.info = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        this.logger.info(LoggerUtils_1.formatLogMessages(messages));
    };
    Logger.debug = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        this.logger.debug(LoggerUtils_1.formatLogMessages(messages));
    };
    Logger.error = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        this.logger.error(messages);
    };
    // ------ UTILITY METHODS FOR GRPC AND REST SERVICES
    Logger.checkCurrentLevels = function (type) {
        if (type === void 0) { type = "grpc"; }
        var transports = [this.transportConsole, this.transportFile];
        var map = {};
        for (var i = 0; i < transports.length; i++) {
            if (!transports[i] ||
                (transports[i].name === LoggerTypes_1.TransportNames.FILE &&
                    !this.checkFileLogLevelStatus().isEnabled))
                continue;
            map[transports[i].name] = transports[i].level || LoggerTypes_1.LogLevelKeys.INFO;
        }
        return LoggerUtils_1.formatLevelsResponse(type, map);
    };
    Logger.checkFileLogLevelStatus = function () {
        var _this = this;
        return {
            isEnabled: this.logger.transports.findIndex(function (t) { return t === _this.transportFile; }) > -1,
        };
    };
    Logger.getTransporter = function (transport) {
        switch (transport) {
            case LoggerTypes_1.Transports.FILE:
            case LoggerTypes_1.TransportNames.FILE:
                return this.transportFile;
            case LoggerTypes_1.Transports.CONSOLE:
            case LoggerTypes_1.TransportNames.CONSOLE:
            default:
                return this.transportConsole;
        }
    };
    Logger.setCurrentLevels = function (type, request) {
        var newLevels = request.newLevels;
        if (!newLevels || !newLevels.length)
            return this.checkCurrentLevels(type);
        for (var i = 0; i < newLevels.length; i++) {
            this.getTransporter(newLevels[i].transport).level = LoggerUtils_1.getLevelText(newLevels[i].level);
        }
        return this.checkCurrentLevels(type);
    };
    Logger.updateFileLogLevelStatus = function (request) {
        var _this = this;
        var transport = this.logger.transports.find(function (transport) { return transport === _this.transportFile; });
        var enable = request.enable;
        if (enable) {
            if (!transport) {
                var success = this.initializeFileTransport();
                if (success) {
                    this.logger.add(this.transportFile);
                }
            }
        }
        else {
            if (transport) {
                this.logger.remove(transport);
            }
        }
        return this.checkFileLogLevelStatus();
    };
    Logger.printLogs = function () {
        Logger.error("TEST LOGS");
        Logger.debug("TEST LOGS");
        Logger.info("TEST LOGS");
        Logger.warn("TEST LOGS");
        return "OK";
    };
    return Logger;
}());
exports.Logger = Logger;
exports.default = Logger;
