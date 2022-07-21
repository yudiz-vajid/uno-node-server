import HealthCheckResult from "./HealthCheckResult";
import { IHealthCheck } from "./IHealthCheck";
export declare class HealthCheckManager {
    private static ID_SERVER_CHECKS;
    private static instance;
    private checksMap;
    constructor();
    static getInstance(): HealthCheckManager;
    addChecks(serviceName?: string, checks?: Array<IHealthCheck>): void;
    runChecks(serviceName?: string): HealthCheckResult;
}
export default HealthCheckManager;
