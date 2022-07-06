export declare class ConfigProvider<T = unknown> {
    private static instance;
    private zkClient;
    private configsMap;
    private retryConnectCount;
    private constructor();
    static getInstance<T>(): ConfigProvider<T>;
    private registerPath;
    getConfigs(path: string): Promise<T>;
    initiateZKClient(): void;
    private awakeZkClient;
}
export default ConfigProvider;
