#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const util_1 = require("util");
const child_process_1 = require("child_process");
const execPromisified = (0, util_1.promisify)(child_process_1.exec);
function exec(command) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { stdout, stderr } = yield execPromisified(command);
            if (stderr) {
                console.error(`stderr: \n${stderr}`);
                return undefined;
            }
            if (stdout) {
                process.env.HOST = stdout.trim();
                return stdout;
            }
        }
        catch (error) {
            const MAC = (_b = (_a = Object.values((0, os_1.networkInterfaces)()).flat()) === null || _a === void 0 ? void 0 : _a.find(_interface => (_interface === null || _interface === void 0 ? void 0 : _interface.mac) !== '00:00:00:00:00:00')) === null || _b === void 0 ? void 0 : _b.mac;
            if (!MAC) {
                console.error(`error: \n${error.message}`);
                log.error(`${_.now()} unable to fetch ip/MAC.`);
                log.info(`${_.now()} terminating process!!!!!!!.`);
                process.exit(1);
                return undefined;
            }
            process.env.HOST = MAC;
            return MAC;
        }
    });
}
exec('dig +short myip.opendns.com @resolver1.opendns.com');
