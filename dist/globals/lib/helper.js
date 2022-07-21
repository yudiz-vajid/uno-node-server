"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../app/util");
const helper = {
    code: {
        Continue: 100,
        Switching_Protocols: 101,
        Processing: 102,
        Early_Hints: 103,
        OK: 200,
        Created: 201,
        Accepted: 202,
        'Non-Authoritative_Information': 203,
        No_Content: 204,
        Reset_Content: 205,
        Partial_Content: 206,
        'Multi-Status': 207,
        Already_Reported: 208,
        IM_Used: 226,
        Multiple_Choices: 300,
        Moved_Permanently: 301,
        Found: 302,
        See_Other: 303,
        Not_Modified: 304,
        Use_Proxy: 305,
        Temporary_Redirect: 307,
        Permanent_Redirect: 308,
        Bad_Request: 400,
        Unauthorized: 401,
        Payment_Required: 402,
        Forbidden: 403,
        Not_Found: 404,
        Method_Not_Allowed: 405,
        Not_Acceptable: 406,
        Proxy_Authentication_Required: 407,
        Request_Timeout: 408,
        Conflict: 409,
        Gone: 410,
        Length_Required: 411,
        Precondition_Failed: 412,
        Payload_Too_Large: 413,
        URI_Too_Long: 414,
        Unsupported_Media_Type: 415,
        Range_Not_Satisfiable: 416,
        Expectation_Failed: 417,
        "I'm_a_Teapot": 418,
        Misdirected_Request: 421,
        Unprocessable_Entity: 422,
        Locked: 423,
        Failed_Dependency: 424,
        Too_Early: 425,
        Upgrade_Required: 426,
        Precondition_Required: 428,
        Too_Many_Requests: 429,
        Request_Header_Fields_Too_Large: 431,
        Unavailable_For_Legal_Reasons: 451,
        Internal_Server_Error: 500,
        Not_Implemented: 501,
        Bad_Gateway: 502,
        Service_Unavailable: 503,
        Gateway_Timeout: 504,
        HTTP_Version_Not_Supported: 505,
        Variant_Also_Negotiates: 506,
        Insufficient_Storage: 507,
        Loop_Detected: 508,
        Bandwidth_Limit_Exceeded: 509,
        Not_Extended: 510,
        Network_Authentication_Required: 511,
    },
    isObject: (o) => {
        return o instanceof Object && o.constructor === Object;
    },
    isDate: (o) => {
        return o instanceof Object && o.constructor === Date;
    },
    parse: (data) => {
        try {
            return JSON.parse(data);
        }
        catch (error) {
            return data;
        }
    },
    stringify: (data, offset = 0) => {
        return JSON.stringify(data, null, offset);
    },
    toString: (key) => {
        try {
            return key.toString();
        }
        catch (error) {
            return '';
        }
    },
    capitalize: (s) => (s && s[0].toUpperCase() + s.slice(1)) || '',
    getRandomNumber: (min = 0, max = 100000) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    clone: (data = {}) => {
        const originalData = data.toObject ? data.toObject() : data;
        const eType = originalData ? originalData.constructor : 'normal';
        if (eType === Object)
            return Object.assign({}, originalData);
        if (eType === Array)
            return [...originalData];
        return data;
    },
    deepClone: (data) => {
        try {
            return helper.parse(helper.stringify(data));
        }
        catch (error) {
            return data;
        }
    },
    isArray: (data) => {
        for (let i = 0; i < data.length; i += 1) {
            if (!Array.isArray(data[i]))
                return false;
        }
        return true;
    },
    pick: (obj, array) => {
        const clonedObj = helper.clone(obj);
        return array.reduce((acc, elem) => {
            if (elem in clonedObj)
                acc[elem] = clonedObj[elem];
            return acc;
        }, {});
    },
    isEmpty: (obj) => {
        if (obj === null || obj === undefined || Array.isArray(obj) || typeof obj !== 'object') {
            return true;
        }
        return Object.getOwnPropertyNames(obj).length === 0;
    },
    randomizeArray: (array = []) => {
        return array.sort(() => util_1.mersenneTwister.random() - 0.5);
    },
    now: () => {
        const dt = new Date();
        return `[${`${dt}`.split(' ')[4]}:${dt.getMilliseconds()}]`;
    },
    ISODate: () => {
        const date = new Date();
        return date.toISOString();
    },
    getTimeDifference(start, end) {
        const diff = end.getTime() - start.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
        const minutes = Math.floor(diff / (1000 * 60)) % 60;
        const seconds = Math.floor(diff / 1000) % 60;
        return {
            days,
            hours,
            minutes,
            seconds,
            ms: diff % 1000,
        };
    },
    getTimeDifferenceFormatted(start, end) {
        const diff = end.getTime() - start.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor(diff / 1000);
        const ms = diff;
        return {
            days,
            hours,
            minutes,
            seconds,
            ms,
        };
    },
    delay: (ttl) => new Promise(resolve => setTimeout(resolve, ttl)),
    getPlayerKey: (iBattleId, iPlayerId) => `t:${iBattleId}:p:${iPlayerId}`,
    getPlayerCountKey: (iBattleId) => `t:${iBattleId}:playerCount`,
    getTableKey: (iBattleId) => `t:${iBattleId}`,
    getSchedulerKey: (sTaskName, iBattleId = '', iPlayerId = '', host = process.env.HOST) => `sch:${iBattleId}:${sTaskName}:${iPlayerId}:${host}`,
    genAckCB: () => {
        return (msg) => {
            log.debug(`client:ack -> ${msg}`);
        };
    },
    omit: (obj, array, deepCloning = false) => {
        const clonedObject = deepCloning ? helper.deepClone(obj) : helper.clone(obj);
        const objectKeys = Object.keys(clonedObject);
        return objectKeys.reduce((acc, elem) => {
            if (!array.includes(elem))
                acc[elem] = clonedObject[elem];
            return acc;
        }, {});
    },
    getRandomWithProbability: (results, weights) => {
        let s = 0;
        const num = Math.random();
        const lastIndex = weights.length - 1;
        for (let i = 0; i < lastIndex; i += 1) {
            s += weights[i];
            if (num < s)
                return results[i];
        }
        return results[lastIndex];
    },
    findMaxFromArrayOfObject: (arrayOfObject, fieldToCheck) => {
        let index = 0;
        let temp = -Infinity;
        for (let i = 0; i < arrayOfObject.length; i += 1) {
            if (temp <= arrayOfObject[i][fieldToCheck]) {
                temp = arrayOfObject[i][fieldToCheck];
                index = i;
            }
        }
        return arrayOfObject[index];
    },
};
exports.default = helper;
