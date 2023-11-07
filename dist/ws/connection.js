"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_1 = require("./format");
const types_1 = require("./types");
const index_1 = require("../errors/index");
const validation_1 = require("../messages/validation");
const uuid = __importStar(require("uuid"));
const purify_ts_1 = require("purify-ts");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("ts-ocpp:ws");
class Connection {
    constructor(socket, requestHandler, requestedActions, respondedActions, rejectInvalidRequests = true, handlers, requestTimeout) {
        this.socket = socket;
        this.requestHandler = requestHandler;
        this.requestedActions = requestedActions;
        this.respondedActions = respondedActions;
        this.rejectInvalidRequests = rejectInvalidRequests;
        this.handlers = handlers;
        this.requestTimeout = requestTimeout;
        this.messageTriggers = {};
    }
    sendRequest(action, { action: _, ocppVersion: __, ...payload }) {
        return purify_ts_1.EitherAsync.fromPromise(async () => {
            var _a, _b;
            const id = uuid.v4();
            const waitResponse = new Promise((resolve, reject) => {
                var _a;
                const timeoutId = setTimeout(() => reject(new index_1.OCPPRequestTimedOutError(action)), (_a = this.requestTimeout) !== null && _a !== void 0 ? _a : 30000);
                this.messageTriggers[id] = function (ocppMessage) {
                    resolve(ocppMessage);
                    clearTimeout(timeoutId);
                };
            });
            debug(`preparing to send request ${action} with id ${id}`);
            const validateResult = validation_1.validateMessageRequest(action, payload, this.respondedActions);
            if (validateResult.isLeft()) {
                debug(`request ${action} with id ${id} is invalid: ${validateResult.extract().toString()}`);
                return purify_ts_1.Left(new index_1.OCPPApplicationError(validateResult.extract().toString()));
            }
            const requestMessage = {
                id,
                type: types_1.MessageType.CALL,
                action,
                payload,
            };
            debug(`sending request %o`, requestMessage);
            (_a = this.handlers) === null || _a === void 0 ? void 0 : _a.onSendRequest(requestMessage);
            await this.sendOCPPMessage(requestMessage);
            const responseMessage = await waitResponse;
            debug(`received response %o`, responseMessage);
            // cleanup function to avoid memory leak
            delete this.messageTriggers[id];
            (_b = this.handlers) === null || _b === void 0 ? void 0 : _b.onReceiveResponse(responseMessage);
            if (responseMessage.type === types_1.MessageType.CALL)
                return purify_ts_1.Left(new index_1.OCPPRequestError('response received was of CALL type, should be either CALLRESULT or CALLERROR'));
            if (responseMessage.type === types_1.MessageType.CALLERROR)
                return purify_ts_1.Left(new index_1.OCPPRequestError('other side responded with error', responseMessage.errorCode, responseMessage.errorDescription, responseMessage.errorDetails));
            return purify_ts_1.Right(responseMessage.payload);
        });
    }
    handleWebsocketData(data) {
        format_1.parseOCPPMessage(data)
            .map(msg => this.handleOCPPMessage(msg))
            .map(async (result) => {
            await result.map(response => this.sendOCPPMessage(response));
        });
    }
    close() {
        this.socket.close();
    }
    async sendOCPPMessage(message) {
        return new Promise((resolve, reject) => {
            this.socket.send(format_1.stringifyOCPPMessage(message), err => {
                err ? reject(err) : resolve();
            });
        });
    }
    handleOCPPMessage(message) {
        return purify_ts_1.MaybeAsync.fromPromise(async () => {
            var _a, _b, _c;
            debug(`received message %o`, message);
            switch (message.type) {
                case types_1.MessageType.CALL:
                    (_a = this.handlers) === null || _a === void 0 ? void 0 : _a.onReceiveRequest(message);
                    const response = await purify_ts_1.EitherAsync.liftEither(validation_1.validateMessageRequest(message.action, (_b = message.payload) !== null && _b !== void 0 ? _b : {}, this.requestedActions))
                        .map(request => ({ request }))
                        .chainLeft(async (validationError) => {
                        return (this.rejectInvalidRequests
                            ? purify_ts_1.Left(validationError)
                            // allow invalid requests to be passed to the handler
                            : purify_ts_1.Right({
                                validationError,
                                request: { action: message.action, ocppVersion: 'v1.6-json', ...message.payload }
                            }));
                    })
                        .chain(async ({ request, validationError }) => {
                        try {
                            const response = await this.requestHandler(request, validationError);
                            return purify_ts_1.Right(response);
                        }
                        catch (error) {
                            return purify_ts_1.Left(new index_1.OCPPApplicationError('on handling chargepoint request').wrap(error));
                        }
                    });
                    const formattedResponse = response
                        // merge both failure and success to a OCPP-J message
                        .either(fail => ({
                        id: message.id,
                        type: types_1.MessageType.CALLERROR,
                        errorCode: 'GenericError',
                        errorDescription: `[${fail.name}] ${fail.message}`,
                        errorDetails: fail,
                    }), 
                    // remove action and ocpp version from payload
                    ({ action: _action, ocppVersion: _ocppVersion, ...payload }) => ({
                        type: types_1.MessageType.CALLRESULT,
                        id: message.id,
                        payload,
                    }));
                    (_c = this.handlers) === null || _c === void 0 ? void 0 : _c.onSendResponse(formattedResponse);
                    return purify_ts_1.Just(formattedResponse);
                case types_1.MessageType.CALLERROR:
                case types_1.MessageType.CALLRESULT:
                    this.messageTriggers[message.id](message);
            }
            return purify_ts_1.Nothing;
        });
    }
}
exports.default = Connection;
//# sourceMappingURL=connection.js.map