import { LoggerOptions } from "winston";
import { ManageLoggerRequestTypes, SetLogLevelsRequest } from "./LoggerTypes";
export declare class Logger {
    private static logger;
    private static transportConsole;
    private static transportFile;
    private static serviceLabel;
    private static getLogFormat;
    private static customLogFormat;
    private static initializeFileTransport;
    static initialize(label: string, options?: LoggerOptions): void;
    static warn(...messages: any[]): void;
    static info(...messages: any[]): void;
    static debug(...messages: any[]): void;
    static error(...messages: any[]): void;
    static checkCurrentLevels(type?: ManageLoggerRequestTypes): {
        currentLevels: {
            transport: string;
            level: string;
        }[];
    };
    static checkFileLogLevelStatus(): {
        isEnabled: boolean;
    };
    private static getTransporter;
    static setCurrentLevels(type: ManageLoggerRequestTypes, request: SetLogLevelsRequest): {
        currentLevels: {
            transport: string;
            level: string;
        }[];
    };
    static updateFileLogLevelStatus(request: {
        enable: boolean;
    }): {
        isEnabled: boolean;
    };
    static printLogs(): string;
}
export default Logger;
