"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevelText = exports.formatLevelsResponse = exports.getErrorString = exports.formatLogMessages = exports.removeEscapeCharacters = void 0;
var LoggerTypes_1 = require("../logging/LoggerTypes");
/**
 * Internal
 * @param {Object} message object to format
 * @returns {String} in format " key: value, "
 */
var removeEscapeCharacters = function (message, isLast) {
    // stringify return undefined type when passed undefined, returning empty string instead
    var stringified = message;
    if (typeof stringified !== "string") {
        stringified = JSON.stringify(message) || "";
        stringified = stringified.replace(/\\/g, "");
    }
    if (!isLast)
        stringified = stringified.concat(", ");
    return stringified;
};
exports.removeEscapeCharacters = removeEscapeCharacters;
/**
 *
 * @param {Array} messages containing text to print
 */
var formatLogMessages = function (messages) {
    return messages.reduce(function (val, curr, idx) {
        return (val += exports.removeEscapeCharacters(curr, idx === messages.length - 1));
    }, "");
};
exports.formatLogMessages = formatLogMessages;
var getErrorString = function (message) {
    if (!Array.isArray(message))
        return message;
    var result = "";
    for (var i = 0; i < message.length; i++) {
        var skip = false;
        if (typeof message[i] === "object") {
            if (message[i].hasOwnProperty("message") ||
                message[i].hasOwnProperty("stack")) {
                skip = true;
                result += (!message[i].stack && message[i].message ? message[i].message : "") + " " + (message[i].stack ? message[i].stack : "") + " ";
            }
        }
        if (!skip)
            result += exports.removeEscapeCharacters(message[i], i === message.length - 1);
    }
    return result;
};
exports.getErrorString = getErrorString;
var formatLevelsResponse = function (type, response) {
    var currentLevels = [];
    for (var k in response) {
        if (type === "grpc") {
            currentLevels.push({
                transport: LoggerTypes_1.TransportGrpcMapping[k],
                level: LoggerTypes_1.LogLevelsGrpcMapping[response[k]],
            });
        }
        else {
            currentLevels.push({ transport: k, level: response[k] });
        }
    }
    return { currentLevels: currentLevels };
};
exports.formatLevelsResponse = formatLevelsResponse;
var getLevelText = function (level) {
    switch (level) {
        case LoggerTypes_1.LogLevel.DEBUG:
        case LoggerTypes_1.LogLevelKeys.DEBUG:
            return LoggerTypes_1.LogLevelKeys.DEBUG;
        case LoggerTypes_1.LogLevel.WARN:
        case LoggerTypes_1.LogLevelKeys.WARN:
            return LoggerTypes_1.LogLevelKeys.WARN;
        case LoggerTypes_1.LogLevel.INFO:
        case LoggerTypes_1.LogLevelKeys.INFO:
            return LoggerTypes_1.LogLevelKeys.INFO;
        case LoggerTypes_1.LogLevel.ERROR:
        case LoggerTypes_1.LogLevelKeys.ERROR:
        default:
            return LoggerTypes_1.LogLevelKeys.ERROR;
    }
};
exports.getLevelText = getLevelText;
