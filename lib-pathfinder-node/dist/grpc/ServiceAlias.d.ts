/**
 * @deprecated - even before first release
 */
declare class ServiceAlias {
    private PFV_TAG;
    private port;
    private name;
    private tags;
    private id;
    private isRegistered;
    constructor(name: string, port: number, ...tags: string[]);
    register(): Promise<void>;
    deregister(): Promise<void>;
    private consulRegister;
    private consulDeregister;
}
export default ServiceAlias;
