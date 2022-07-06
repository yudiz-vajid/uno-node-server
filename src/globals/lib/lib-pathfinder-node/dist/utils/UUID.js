"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUID = void 0;
var UUID = /** @class */ (function () {
    function UUID() {
    }
    UUID.getUUID = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };
    return UUID;
}());
exports.UUID = UUID;
exports.default = UUID;
