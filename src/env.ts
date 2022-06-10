import { IEnvs } from './types/global';

process.env.NODE_ENV = 'stag';
process.env.PORT = '3010';
process.env.HOST = `127.0.0.111/${process.env.NODE_ENV}`;

process.env.DB_PASSWORD = '';

const oEnv: IEnvs = {
  dev: {
    BASE_URL: `http://${process.env.HOST}:${process.env.PORT}`,
    REDIS_DB: '0',
    // REDIS_HOST: 'redis-14637.c301.ap-south-1-1.ec2.cloud.redislabs.com',
    REDIS_HOST: 'redis-14966.c264.ap-south-1-1.ec2.cloud.redislabs.com',
    REDIS_PORT: '14966',
    REDIS_USERNAME: 'default',
    REDIS_PASSWORD: 'YYF9EYtDplvfU1RB8icxtGTYooswpTyr',
  },
  stag: {
    BASE_URL: `http://${process.env.HOST}:${process.env.PORT}`,
    REDIS_DB: '0',
    REDIS_HOST: 'redis-14637.c301.ap-south-1-1.ec2.cloud.redislabs.com',
    REDIS_PORT: '14637',
    REDIS_USERNAME: 'default',
    REDIS_PASSWORD: 'kderTDhubKYjmcW1ilCdjly0fFNdxihJ',
  },
  // prod: {},
};
const winstonLogLevel: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly' = 'debug';
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

export {};

/*
    redis.publisher.publish('redisEvent', JSON.stringify({ a: 10, b: 20 }));
    then on onMessage we got :> channel : 'redisEvent, message: '{ a: 10, b: 20 }'

    redis.publisher.publish('redisEvent', JSON.stringify({ sTaskName: '', iTabled: '', iPlayerId: '' }));
     channel : redisEvent
     message: { sTaskName: '', iTabled: '', iPlayerId: '' }

*/

/*
    export VIEW_JSON_DEFAULT=all && redis-commander --redis-host redis-16750.c275.us-east-1-4.ec2.cloud.redislabs.com --redis-port 16750 --redis-password 1LUOg6WlPX6eK15Shtfa0iLUGsdjkNlc
    export VIEW_JSON_DEFAULT=all && redis-commander
    redis-cli -h redis-16750.c275.us-east-1-4.ec2.cloud.redislabs.com -p 16750 -a 1LUOg6WlPX6eK15Shtfa0iLUGsdjkNlc
*/

// docker run -t -v redis_vol:/data -p 6379:6379 -p 8002:8001 redis/redis-stack:latest

//  mongorestore --uri mongodb+srv://evil:1526@cluster.cnn8e.mongodb.net
// mongodump --uri mongodb+srv://evil:1526@cluster.cnn8e.mongodb.net/epiko-stag
