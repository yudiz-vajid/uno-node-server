import HealthCheckResult from "./HealthCheckResult";
import { IHealthCheck } from "./IHealthCheck";
export declare class DefaultHealthCheck implements IHealthCheck {
    getIdentifier(): string;
    check(): HealthCheckResult;
}
export default DefaultHealthCheck;
