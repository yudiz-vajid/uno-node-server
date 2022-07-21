import { ServiceClient } from "@grpc/grpc-js/build/src/make-client";
import { Options } from "@grpc/proto-loader";
export interface ILoadProtoRequest {
    name: string;
    path: string;
}
export interface MetaObject {
    [key: string]: any;
}
export declare type ILoadProtos = Array<ILoadProtoRequest>;
export interface GetClientRequest {
    serviceNameInProto: string;
    serviceName: string;
    tag?: string;
    options?: {
        meta: MetaObject;
        timeout: number;
    };
}
export declare class PFClientProvider {
    private protoMap;
    private static instance;
    private promisify;
    private protos;
    private asyncProtoMap;
    private loadOpts?;
    constructor(promisify?: boolean);
    static getInstance(): PFClientProvider;
    static initialize(promisify?: boolean): void;
    loadProtos(protos: ILoadProtos, loadOpts?: Options, disableProtoSyncLoading?: boolean): void;
    startAsyncLoading(): Promise<void>;
    loadProtoForServiceAsync(serviceName: string): Promise<unknown>;
    loadProtoForService(serviceName: string, isAsync?: boolean): Promise<any>;
    getProtoDescriptor(serviceName: string): Promise<any>;
    private getPrettyMethodName;
    getClient({ serviceNameInProto, serviceName, tag, options, }: GetClientRequest): Promise<ServiceClient>;
}
export default PFClientProvider;
