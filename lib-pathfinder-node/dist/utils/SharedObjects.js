"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var consul_1 = __importDefault(require("consul"));
var SharedObjects = /** @class */ (function () {
    function SharedObjects(consulHost) {
        this.consulClient = new consul_1.default({
            baseUrl: consulHost ? "http://" + consulHost + "/v1" : undefined,
            promisify: true,
        });
    }
    SharedObjects.getInstance = function () {
        return this.instance;
    };
    SharedObjects.initialize = function (consulHost) {
        if (this.instance)
            return;
        this.instance = new SharedObjects(consulHost);
    };
    SharedObjects.prototype.getConsulClient = function () {
        return this.consulClient;
    };
    return SharedObjects;
}());
exports.default = SharedObjects;
