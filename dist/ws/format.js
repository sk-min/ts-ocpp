"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyOCPPMessage = exports.parseOCPPMessage = void 0;
const types_1 = require("./types");
const errors_1 = require("../errors");
const purify_ts_1 = require("purify-ts");
const parseOCPPMessage = (raw) => {
    try {
        if (typeof raw !== 'string')
            return purify_ts_1.Left(new errors_1.ValidationError('only string is supported'));
        const [type, id, ...rest] = JSON.parse(raw);
        switch (type) {
            case types_1.MessageType.CALL: {
                const [action, payload] = rest;
                return purify_ts_1.Right({
                    type: types_1.MessageType.CALL,
                    id,
                    action,
                    ...(payload ? { payload } : {})
                });
            }
            case types_1.MessageType.CALLRESULT: {
                const [payload] = rest;
                return purify_ts_1.Right({
                    type: types_1.MessageType.CALLRESULT,
                    id,
                    ...(payload ? { payload } : {})
                });
            }
            case types_1.MessageType.CALLERROR: {
                const [errorCode, errorDescription, errorDetails] = rest;
                return purify_ts_1.Right({
                    type: types_1.MessageType.CALLERROR,
                    id,
                    errorCode,
                    errorDescription,
                    ...(errorDetails ? { errorDetails } : {}),
                });
            }
            default: return purify_ts_1.Left(new errors_1.ValidationError(`Not supported message type: ${type}`));
        }
    }
    catch (err) {
        return purify_ts_1.Left(new errors_1.ValidationError(`An error occurred when trying to parse message: "${raw}"`).wrap(err));
    }
};
exports.parseOCPPMessage = parseOCPPMessage;
const stringifyOCPPMessage = (message) => {
    switch (message.type) {
        case types_1.MessageType.CALL: {
            const { type, id, action, payload } = message;
            return JSON.stringify([type, id, action, ...(payload ? [payload] : [])]);
        }
        case types_1.MessageType.CALLRESULT: {
            const { type, id, payload } = message;
            return JSON.stringify([type, id, ...(payload ? [payload] : [])]);
        }
        case types_1.MessageType.CALLERROR: {
            const { type, id, errorCode, errorDescription, errorDetails } = message;
            return JSON.stringify([type, id, errorCode, errorDescription, ...(errorDetails ? [errorDetails] : [])]);
        }
    }
};
exports.stringifyOCPPMessage = stringifyOCPPMessage;
//# sourceMappingURL=format.js.map