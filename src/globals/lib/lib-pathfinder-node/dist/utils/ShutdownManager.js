"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShutdownManager = void 0;
var Logger_1 = __importDefault(require("../logging/Logger"));
var ShutdownManager = /** @class */ (function () {
    function ShutdownManager() {
        var _this = this;
        this.listeners = Array();
        process.on("SIGINT", function () {
            _this.executeShutdown();
        });
        process.on("SIGTERM", function () {
            _this.executeShutdown();
        });
        process.on("message", function (message) {
            if (message === "shutdown") {
                _this.executeShutdown();
            }
        });
    }
    ShutdownManager.getInstance = function () {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new ShutdownManager();
        }
        return this.instance;
    };
    ShutdownManager.prototype.addShutdownListener = function (listener) {
        this.listeners.push(listener);
    };
    ShutdownManager.prototype.triggerBeforeShutdown = function (listener) {
        try {
            return listener.beforeShutdown();
        }
        catch (error) {
            Logger_1.default.error("Unhandled exception in listener: ", listener, error);
        }
        return 0;
    };
    ShutdownManager.prototype.triggerAfterShutdown = function (listener) {
        try {
            listener.afterShutdown();
        }
        catch (error) {
            Logger_1.default.error("Unhandled exception in listener ", listener, error);
        }
    };
    ShutdownManager.prototype.executeShutdown = function (code) {
        var _this = this;
        if (code === void 0) { code = 0; }
        Logger_1.default.info("Executing ShutdownHook. Listeners: ", this.listeners.length);
        var shutdownDelay = 0;
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var sl = _a[_i];
            var delay = this.triggerBeforeShutdown(sl);
            if (shutdownDelay < delay)
                shutdownDelay = delay;
        }
        setTimeout(function () {
            for (var _i = 0, _a = _this.listeners; _i < _a.length; _i++) {
                var sl = _a[_i];
                _this.triggerAfterShutdown(sl);
            }
            Logger_1.default.info("Good bye!!!");
            if (code === 0) {
                process.exit(0);
            }
        }, shutdownDelay);
    };
    return ShutdownManager;
}());
exports.ShutdownManager = ShutdownManager;
exports.default = ShutdownManager;
