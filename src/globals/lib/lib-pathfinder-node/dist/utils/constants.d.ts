export declare const TAG_DEFAULT = "DEFAULT";
export declare const isRunningLocally: () => boolean;
export declare const isRunningOnJenkins: () => boolean;
export declare enum Enviroments {
    DEV = "dev"
}
export declare const FydeEnvMap: {
    dev: {
        consulHost: string;
        fydeSuffix: string;
    };
};
export declare const VpnEnvMap: {
    dev: {
        consulHost: string;
    };
};
export declare const LOGGER_URLs: {
    CHECK_CURRENT_LEVELS: string;
    SET_CURRENT_LEVELS: string;
    CHECK_FILE_LOG_LEVEL_STATUS: string;
    UPDATE_FILE_LOG_LEVEL_STATUS: string;
    CHECK_LOG_LEVELS: string;
};
export declare const ERR_METHOD_NOT_ALLOWED: {
    error: {
        message: string;
    };
    status: number;
};
export declare const METHOD_GET = "GET";
export declare const METHOD_POST = "POST";
export declare const isRunningOverVPN: () => boolean;
export declare const ZK_CONFIG_URLS = "zk1.mpl.internal:2181,zk2.mpl.internal:2181,zk3.mpl.internal:2181,zk4.mpl.internal:2181,zk5.mpl.internal:2181";
export declare const EVENT_CONNECTED = "connected";
export declare const EVENT_CONNECTED_READY_ONLY = "connectedReadOnly";
export declare const UNKNOWN_STATE = "Client state is unknown.";
