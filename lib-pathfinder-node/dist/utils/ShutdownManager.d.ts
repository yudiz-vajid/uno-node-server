export interface ShutdownListener {
    beforeShutdown(): number;
    afterShutdown(): void;
}
export declare class ShutdownManager {
    private static instance;
    private listeners;
    constructor();
    static getInstance(): ShutdownManager;
    addShutdownListener(listener: ShutdownListener): void;
    private triggerBeforeShutdown;
    private triggerAfterShutdown;
    private executeShutdown;
}
export default ShutdownManager;
