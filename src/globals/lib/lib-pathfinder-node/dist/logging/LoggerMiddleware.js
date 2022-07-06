"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
var constants_1 = require("../utils/constants");
var Logger_1 = __importDefault(require("./Logger"));
var loggerMiddleware = function () { return function (req, res, next) {
    var url = req.originalUrl;
    var result;
    switch (url) {
        case constants_1.LOGGER_URLs.CHECK_CURRENT_LEVELS:
            result =
                req.method.toUpperCase() === constants_1.METHOD_GET
                    ? Logger_1.default.checkCurrentLevels("rest")
                    : constants_1.ERR_METHOD_NOT_ALLOWED;
            break;
        case constants_1.LOGGER_URLs.SET_CURRENT_LEVELS:
            result =
                req.method.toUpperCase() === constants_1.METHOD_POST
                    ? Logger_1.default.setCurrentLevels("rest", req.body)
                    : constants_1.ERR_METHOD_NOT_ALLOWED;
            break;
        case constants_1.LOGGER_URLs.CHECK_FILE_LOG_LEVEL_STATUS:
            result =
                req.method.toUpperCase() === constants_1.METHOD_GET
                    ? Logger_1.default.checkFileLogLevelStatus()
                    : constants_1.ERR_METHOD_NOT_ALLOWED;
            break;
        case constants_1.LOGGER_URLs.UPDATE_FILE_LOG_LEVEL_STATUS:
            result =
                req.method.toUpperCase() === constants_1.METHOD_POST
                    ? Logger_1.default.updateFileLogLevelStatus(req.body)
                    : constants_1.ERR_METHOD_NOT_ALLOWED;
            break;
        case constants_1.LOGGER_URLs.CHECK_LOG_LEVELS:
            result =
                req.method.toUpperCase() === constants_1.METHOD_GET
                    ? Logger_1.default.printLogs()
                    : constants_1.ERR_METHOD_NOT_ALLOWED;
            break;
        default:
            return next();
    }
    return res
        .status((result && result.status) || 200)
        .json((result && result.error) || result);
}; };
exports.loggerMiddleware = loggerMiddleware;
exports.default = exports.loggerMiddleware;
