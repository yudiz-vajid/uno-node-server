"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySettings = exports.verifyAuthHeader = void 0;
var verifyAuthHeaders_1 = require("./lib/verifyAuthHeaders");
Object.defineProperty(exports, "verifyAuthHeader", { enumerable: true, get: function () { return verifyAuthHeaders_1.isValidRequest; } });
var verifySettings_1 = require("./lib/verifySettings");
Object.defineProperty(exports, "verifySettings", { enumerable: true, get: function () { return verifySettings_1.isValidRequest; } });
