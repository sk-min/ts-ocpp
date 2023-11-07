"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cs_1 = require("../messages/cs");
const ws_1 = __importDefault(require("ws"));
const ws_2 = require("../ws");
const cp_1 = require("../messages/cp");
const purify_ts_1 = require("purify-ts");
const errors_1 = require("../errors");
// | {
//   ocppVersion: 'v1.5-soap',
//   chargePointUrl: string,
//   chargePointId: string,
//   payload: Omit<Request<T, V>, 'action' | 'ocppVersion'>,
//   action: T,
// };
/**
 * Represents a connection to the central system
 *
 * @example
 * import { ChargePoint } from '@voltbras/ts-ocpp';
 *
 * const chargePointId = '123';
 * const centralSystemUrl = 'ws://central-system.com/ocpp';
 * const chargePoint = new ChargePoint(
 *  chargePointId,
 *  // request handler
 *  req => {
 *    if (req.action === 'RemoteStartTransaction')
 *      return {
 *        action: req.action,
 *        ocppVersion: req.ocppVersion,
 *        status: 'Accepted'
 *      };
 *    throw new Error('no handler defined')
 *  }),
 *  centralSystemUrl
 * );
 *
 * @category Charge Point
 */
class ChargePoint {
    constructor(id, requestHandler, csUrl) {
        this.id = id;
        this.requestHandler = requestHandler;
        this.csUrl = csUrl;
    }
    async connect() {
        const url = `${this.csUrl}/${this.id}`;
        const socket = new ws_1.default(url, ws_2.SUPPORTED_PROTOCOLS);
        const connection = new ws_2.Connection(socket, this.requestHandler, cs_1.centralSystemActions, cp_1.chargePointActions);
        this.connection = connection;
        // this.socket.on('close', () => (this.socket = undefined));
        socket.on('error', console.error);
        socket.on('message', (data) => connection === null || connection === void 0 ? void 0 : connection.handleWebsocketData(data));
        return new Promise((resolve) => {
            socket === null || socket === void 0 ? void 0 : socket.on('open', () => resolve(connection));
        });
    }
    /**
     * @example
     * import { ChargePoint } from '@voltbras/ts-ocpp';
     *
     * async function communicate(chargePoint: ChargePoint) {
     *   const response = await chargePoint.sendRequest({ action: 'Heartbeat', ocppVersion: 'v1.6-json', payload: {}});
     *   // it can be used in a functional way
     *   response.map(payload => payload.currentTime);
     *   // or can be used in the standard JS way(will throw if there was an error)
     *   const unsafeResponse = response.unsafeCoerce();
     * }
     */
    sendRequest(args) {
        return purify_ts_1.EitherAsync.fromPromise(async () => {
            if (!this.connection)
                return purify_ts_1.Left(new errors_1.OCPPRequestError('there is no connection to the central system'));
            const request = {
                ...args.payload,
                action: args.action,
                ocppVersion: args.ocppVersion
            };
            return await this.connection.sendRequest(args.action, request);
        });
    }
    close() {
        var _a;
        (_a = this.connection) === null || _a === void 0 ? void 0 : _a.close();
    }
}
exports.default = ChargePoint;
//# sourceMappingURL=index.js.map