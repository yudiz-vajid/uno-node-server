"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'stag';
process.env.PORT = '3010';
process.env.HOST = '127.0.0.1';
process.env.DB_PASSWORD = '';
const oEnv = {
    dev: {
        BASE_URL: `http://${process.env.HOST}:${process.env.PORT}`,
        REDIS_DB: '0',
        REDIS_HOST: 'redis-14637.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        REDIS_PORT: '14637',
        REDIS_USERNAME: 'default',
        REDIS_PASSWORD: 'kderTDhubKYjmcW1ilCdjly0fFNdxihJ',
    },
    stag: {
        BASE_URL: `http://${process.env.HOST}:${process.env.PORT}`,
        REDIS_DB: '0',
        REDIS_HOST: 'redis-14637.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        REDIS_PORT: '14637',
        REDIS_USERNAME: 'default',
        REDIS_PASSWORD: 'kderTDhubKYjmcW1ilCdjly0fFNdxihJ',
    },
};
const winstonLogLevel = 'silly';
process.env.LOG_LEVEL = winstonLogLevel;
process.env.BASE_URL = oEnv[process.env.NODE_ENV].BASE_URL;
process.env.REDIS_HOST = oEnv[process.env.NODE_ENV].REDIS_HOST;
process.env.REDIS_PORT = oEnv[process.env.NODE_ENV].REDIS_PORT;
process.env.REDIS_DB = oEnv[process.env.NODE_ENV].REDIS_DB;
process.env.REDIS_USERNAME = oEnv[process.env.NODE_ENV].REDIS_USERNAME;
process.env.REDIS_PASSWORD = oEnv[process.env.NODE_ENV].REDIS_PASSWORD;
process.env.REDIS_URL = `redis://${oEnv[process.env.NODE_ENV].REDIS_HOST}:${oEnv[process.env.NODE_ENV].REDIS_PORT} `;
process.env.JWT_SECRET = 'jwt-secret';
console.info(`${process.env.HOST} configured as ${process.env.NODE_ENV}  < / >`);
