/* eslint-disable no-promise-executor-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { EventEmitter } from 'events';

class Emitter extends EventEmitter {
  asyncEmit = (channel: string, data: any) => new Promise(resolve => _emitter.emit(channel, data, resolve));
}
const _emitter = new Emitter();

export default _emitter;
