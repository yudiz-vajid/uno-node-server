/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import { Server } from 'socket.io';
import type { Express } from 'express';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import PathFinder from 'lib-pathfinder-node';
import './lib/fetch_ip';
import logger from './lib/logs';
import helper from './lib/helper';
import builder from './lib/messages';
import _emitter from './lib/emitter';
import type { RedisClient } from '../app/util';

declare global {
  var _: typeof helper;
  var log: typeof logger;
  var emitter: typeof _emitter;
  var messages: typeof builder;
  var redis: RedisClient; // it will be initialized on  redis.initialize()
  var redis: RedisClient; // it will be initialized on  redis.initialize()
  var io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>; // it will be initialized on  socket.initialize()
  var app: Express;
  var PF: typeof PathFinder;
}

global._ = helper;
global.log = logger;
global.emitter = _emitter;
global.messages = builder;
// global.redis = new RedisClient();
global.PF = PathFinder;

export {};
