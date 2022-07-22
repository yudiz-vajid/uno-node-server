"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Emitter extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.asyncEmit = (channel, data) => new Promise(resolve => _emitter.emit(channel, data, resolve));
    }
}
const _emitter = new Emitter();
exports.default = _emitter;
