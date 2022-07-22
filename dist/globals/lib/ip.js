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
const util_1 = require("util");
const child_process_1 = require("child_process");
const execPromisified = (0, util_1.promisify)(child_process_1.exec);
function exec(command) {
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
            return undefined;
        }
        catch (error) {
            console.error(`error: \n${error.message}`);
            return undefined;
        }
    });
}
exec('dig +short myip.opendns.com @resolver1.opendns.com');
