import { ShutdownListener } from "../utils/ShutdownManager";
export interface IMeta {
    [key: string]: string | number | boolean;
}
export declare type IConsulResponse = Array<IConsulServiceData>;
export interface IConsulServiceData {
    ID: string;
    Node: string;
    Address: string;
    Datacenter: string;
    NodeMeta: IMeta;
    CreateIndex: number;
    ModifyIndex: number;
    ServiceAddress: string;
    ServiceEnableTagOverride: boolean;
    ServiceID: string;
    ServiceName: String;
    ServicePort: number;
    ServiceMeta: IMeta;
    ServiceTags: Array<string>;
    Namespace: string;
}
export interface IHostData {
    currIdx: number;
    serviceIndex?: number;
    services: Array<string>;
}
declare class PFNameResolver implements ShutdownListener {
    private static instance;
    private serviceMap;
    private watchesMap;
    private singleCallMap;
    private fydeSuffix;
    private isLocalDev;
    private isOnVpn;
    constructor(fydeSuffix?: string, isLocalDev?: boolean, isOnVpn?: boolean);
    beforeShutdown(): number;
    afterShutdown(): void;
    static initialize(fydeSuffix?: string, isLocalDev?: boolean, isOnVpn?: boolean): void;
    static getInstance(): PFNameResolver;
    getUrl(serviceName: string, tag?: string): Promise<string>;
    private initAndSetWatcherForPath;
    private parseServicesFromData;
    private getCachedUrl;
    clearWatch(serviceName: string, tag: string): void;
    clearAllWatches(): void;
}
export default PFNameResolver;
