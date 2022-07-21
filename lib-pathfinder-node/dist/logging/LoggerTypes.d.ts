import { AbstractConfigSetLevels } from "winston/lib/winston/config";
export declare const LogLevels: AbstractConfigSetLevels;
export declare type ManageLoggerRequestTypes = "grpc" | "rest";
export declare const LogLevelKeys: {
    ERROR: string;
    WARN: string;
    INFO: string;
    DEBUG: string;
};
export declare enum LogLevel {
    ERROR = "ERROR",
    WARN = "WARN",
    INFO = "INFO",
    DEBUG = "DEBUG"
}
export declare const TransportNames: {
    CONSOLE: string;
    FILE: string;
};
export declare enum Transports {
    CONSOLE = "CONSOLE",
    FILE = "FILE"
}
export declare const LogLevelsGrpcMapping: {
    [x: string]: LogLevel;
};
export declare const TransportGrpcMapping: {
    [x: string]: Transports;
};
interface LogLevelRequest {
    transport: Transports | string;
    level: LogLevel | string;
}
export interface SetLogLevelsRequest {
    newLevels: Array<LogLevelRequest>;
}
export {};
