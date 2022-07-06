"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNKNOWN_STATE = exports.EVENT_CONNECTED_READY_ONLY = exports.EVENT_CONNECTED = exports.ZK_CONFIG_URLS = exports.isRunningOverVPN = exports.METHOD_POST = exports.METHOD_GET = exports.ERR_METHOD_NOT_ALLOWED = exports.LOGGER_URLs = exports.VpnEnvMap = exports.FydeEnvMap = exports.Enviroments = exports.isRunningOnJenkins = exports.isRunningLocally = exports.TAG_DEFAULT = void 0;
exports.TAG_DEFAULT = "DEFAULT";
var isRunningLocally = function () {
    var env = process.env.NODE_ENV;
    if (env) {
        env = env.toLowerCase();
    }
    return env ? ["dev", "development", "develop", "local"].includes(env) : false;
};
exports.isRunningLocally = isRunningLocally;
var isRunningOnJenkins = function () {
    var env = process.env.NODE_ENV;
    if (env) {
        env = env.toLowerCase();
    }
    return env ? ["jenkins"].includes(env) : false;
};
exports.isRunningOnJenkins = isRunningOnJenkins;
var Enviroments;
(function (Enviroments) {
    Enviroments["DEV"] = "dev";
})(Enviroments = exports.Enviroments || (exports.Enviroments = {}));
exports.FydeEnvMap = (_a = {},
    _a[Enviroments.DEV] = {
        consulHost: "dev-consul.mpl.live",
        fydeSuffix: ".in.dev",
    },
    _a);
exports.VpnEnvMap = (_b = {},
    _b[Enviroments.DEV] = {
        consulHost: "172.31.25.224:8500",
    },
    _b);
exports.LOGGER_URLs = {
    CHECK_CURRENT_LEVELS: "/logger/check-levels",
    SET_CURRENT_LEVELS: "/logger/set-levels",
    CHECK_FILE_LOG_LEVEL_STATUS: "/logger/check-file-log-status",
    UPDATE_FILE_LOG_LEVEL_STATUS: "/logger/set-file-log-status",
    CHECK_LOG_LEVELS: "/logger/print-test-logs",
};
exports.ERR_METHOD_NOT_ALLOWED = {
    error: {
        message: "METHOD_NOT_ALLOWED",
    },
    status: 405,
};
exports.METHOD_GET = "GET";
exports.METHOD_POST = "POST";
var isRunningOverVPN = function () {
    return process.env.ON_VPN === "true";
};
exports.isRunningOverVPN = isRunningOverVPN;
// ZK Constants
exports.ZK_CONFIG_URLS = "zk1.mpl.internal:2181,zk2.mpl.internal:2181,zk3.mpl.internal:2181,zk4.mpl.internal:2181,zk5.mpl.internal:2181";
exports.EVENT_CONNECTED = "connected";
exports.EVENT_CONNECTED_READY_ONLY = "connectedReadOnly";
exports.UNKNOWN_STATE = "Client state is unknown.";
