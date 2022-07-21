import Consul from "consul";
declare class SharedObjects {
    private static instance;
    private consulClient;
    constructor(consulHost?: string);
    static getInstance(): SharedObjects;
    static initialize(consulHost?: string): void;
    getConsulClient(): Consul.Consul;
}
export default SharedObjects;
