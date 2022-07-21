import { ServiceClient } from "@grpc/grpc-js/build/src/make-client";
import { Options } from "@grpc/proto-loader";
import { LoggerOptions } from "winston";
import { GetClientRequest, ILoadProtos } from "./grpc/PFClientProvider";
import { Enviroments } from "./utils/constants";
export interface HostData {
}
export interface HostInfoMap {
    [serviceName: string]: {
        [tag: string]: Array<HostData>;
    };
}
export interface PFInitOptions {
    appName: string;
    protosToLoad?: ILoadProtos;
    promisify?: boolean;
    loadOpts?: Options;
    disableProtoSyncLoading?: boolean;
    envToConsider?: Enviroments;
    loggerOptions?: LoggerOptions;
}
declare class PathFinder {
    static VERSION: string;
    private static instance;
    private aliases;
    constructor();
    /**
     * Method to get singleton instance of type PathFinder
     * @returns Instace of class PathFinder
     */
    static getInstance(): PathFinder;
    /**
     * Mehotd to initailze the PathFinder library, make sure to call it once in the root of the application
     * @param param0 Object of Type PFInitOptions
     * @returns void
     */
    static initialize({ appName, protosToLoad, promisify, loadOpts, envToConsider, loggerOptions, disableProtoSyncLoading, }: PFInitOptions): void;
    getServerUrl(serviceName: string, tag?: string): Promise<string>;
    startProtoLoading(): Promise<void>;
    /**
     * @deprecated
     * This method should not be used
     * @param serviceName string name of the service
     * @param port port on which to run this server
     * @param tags comma separate tags
     * @returns `Promise<ServiceAlias>`
     */
    private registerAlias;
    /**
     * Method to get the gRPC communication channel to other service
     * @param param0 Object of type `GetClietnRequest`
     * @returns `Promise<ServiceClient>`
     */
    getClient({ serviceNameInProto, serviceName, tag, options, }: GetClientRequest): Promise<ServiceClient>;
}
export default PathFinder;
export * from "./grpc/PFServer";
export * from "./logging/Logger";
export * from "./logging/LoggerMiddleware";
export * from "./zookeeper";
