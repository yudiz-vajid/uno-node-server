import { Client } from "node-zookeeper-client";
export declare class ZookeeperConfig<T> {
    private path;
    private configData;
    private dataPromise;
    constructor(path: string);
    getData(zkClient: Client): Promise<T>;
    private getZkData;
    private setWatcher;
    private refreshConfigData;
}
export default ZookeeperConfig;
