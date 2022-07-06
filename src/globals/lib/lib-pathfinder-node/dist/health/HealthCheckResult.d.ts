export declare enum HealthCheckStatus {
    OK = "OK",
    ERROR = "ERROR",
    FAILED = "FAILED",
    UNKNOWN = "UNKNOWN"
}
export declare class HealthCheckResult {
    static ERROR: HealthCheckResult;
    static SUCCESS: HealthCheckResult;
    private _status;
    private _message;
    constructor(status: HealthCheckStatus, message?: string);
    get status(): HealthCheckStatus;
    set status(status: HealthCheckStatus);
    get message(): string;
    set message(message: string);
    toString(): string;
}
export default HealthCheckResult;
