"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCPPRequestTimedOutError = exports.OCPPRequestError = exports.OCPPApplicationError = exports.ValidationError = exports.GenericError = void 0;
class GenericError extends Error {
    wrap(error) {
        return {
            ...this,
            message: `${this.message}: ${error.message}`
        };
    }
}
exports.GenericError = GenericError;
class ValidationError extends GenericError {
    constructor() {
        super(...arguments);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class OCPPApplicationError extends GenericError {
    constructor() {
        super(...arguments);
        this.name = "OCPPApplicationError";
    }
}
exports.OCPPApplicationError = OCPPApplicationError;
class OCPPRequestError extends GenericError {
    constructor(message, errorCode, errorDescription, errorDetails) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.errorDetails = errorDetails;
        this.name = "OCPPRequestError";
    }
}
exports.OCPPRequestError = OCPPRequestError;
class OCPPRequestTimedOutError extends OCPPRequestError {
    constructor(action) {
        super('OCPP request timed out');
        this.action = action;
        this.name = "OCPPRequestTimedOutError";
    }
}
exports.OCPPRequestTimedOutError = OCPPRequestTimedOutError;
//# sourceMappingURL=index.js.map