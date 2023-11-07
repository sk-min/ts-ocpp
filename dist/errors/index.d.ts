import { ErrorCode } from "../ws";
export declare class GenericError extends Error {
    wrap(error: Error): this;
}
export declare class ValidationError extends GenericError {
    name: string;
}
export declare class OCPPApplicationError extends GenericError {
    name: string;
}
export declare class OCPPRequestError extends GenericError {
    readonly message: string;
    readonly errorCode?: ErrorCode | undefined;
    readonly errorDescription?: string | undefined;
    readonly errorDetails?: object | undefined;
    name: string;
    constructor(message: string, errorCode?: ErrorCode | undefined, errorDescription?: string | undefined, errorDetails?: object | undefined);
}
export declare class OCPPRequestTimedOutError extends OCPPRequestError {
    readonly action: string;
    name: string;
    constructor(action: string);
}
