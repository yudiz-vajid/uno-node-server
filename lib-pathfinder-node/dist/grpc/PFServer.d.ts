import { Options } from "@grpc/proto-loader";
import { ShutdownListener } from "../utils/ShutdownManager";
export declare class PFServer implements ShutdownListener {
    private PFV_TAG;
    private port;
    private id;
    private serviceGroupName;
    private tags;
    private server;
    private isRegistered;
    private isLocalDev;
    constructor(serviceGroupName: string, port: number, ...tags: string[]);
    private loadProto;
    addService(pathToProto: string, pathToMethodExporterFile: string, loadOptions?: Options): PFServer;
    private checkAndAddService;
    start(): Promise<PFServer>;
    shutdown(): Promise<PFServer>;
    shutdownNow(): Promise<PFServer>;
    private consulRegister;
    beforeShutdown(): number;
    afterShutdown(): void;
    private consulDeregister;
}
export default PFServer;
