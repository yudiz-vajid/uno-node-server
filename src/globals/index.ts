/* eslint-disable import/no-relative-packages */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import './lib/ip';
import { Server } from 'socket.io';
import type { Express } from 'express';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { RedisClient } from '../app/util';
import helper from './lib/helper';
import logger from './lib/logs';
import _emitter from './lib/emitter';
import builder from './lib/messages';

declare global {
  var _: typeof helper;
  var log: typeof logger;
  var emitter: typeof _emitter;
  var messages: typeof builder;
  var redis: RedisClient; // it will be initialized on  redis.initialize()
  var io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>; // it will be initialized on  socket.initialize()
  var app: Express;
}

global._ = helper;
global.log = logger;
global.emitter = _emitter;
global.messages = builder;
global.redis = new RedisClient();

export {};
