import HealthCheckResult from "./HealthCheckResult";
export interface IHealthCheck {
    getIdentifier(): string;
    check(): HealthCheckResult;
}
