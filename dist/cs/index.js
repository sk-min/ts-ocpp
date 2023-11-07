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
/**
 * Sets up a central system, that can communicate with charge points
 */
const ws_1 = __importDefault(require("ws"));
const http_1 = require("http");
const cp_1 = require("../messages/cp");
const ws_2 = require("../ws");
const cs_1 = require("../messages/cs");
const errors_1 = require("../errors");
const purify_ts_1 = require("purify-ts");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const soap = __importStar(require("soap"));
const uuid = __importStar(require("uuid"));
const connection_1 = __importDefault(require("../soap/connection"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("ts-ocpp:cs");
const handleProtocols = (protocols) => { var _a; return (_a = protocols.find((protocol) => ws_2.SUPPORTED_PROTOCOLS.includes(protocol))) !== null && _a !== void 0 ? _a : ''; };
/**
 * Represents the central system, can communicate with charge points
 *
 * @example
 * import { CentralSystem } from '@voltbras/ts-ocpp';
 *
 * // port and request handler as arguments
 * const centralSystem = new CentralSystem(3000, (req, { chargePointId }) => {
 *   switch (req.action) {
 *     case 'Heartbeat':
 *       // returns a successful response
 *       // (we pass the action and ocpp version so typescript knows which fields are needed)
 *       return {
 *         action: req.action,
 *         ocppVersion: req.ocppVersion,
 *         currentTime: new Date().toISOString()
 *       };
 *   }
 *   throw new Error('message not supported');
 * });
 *
 * @category Central System
 */
class CentralSystem {
    constructor(port, cpHandler, options = {}) {
        var _a, _b, _c;
        /** each chargepoint has a list of connections because there is an
         * issue with some chargers that do not fully close the previous websocket connection
         * after creating a new websocket connection, with this we can still keep track of all
         * current opened sockets, and only remove the connections whose sockets have closed.
         *
         * (for more info: see the test "if two sockets open before the first one closing, should still remain the latest socket") */
        this.connections = {};
        this.listeners = [];
        this.cpHandler = cpHandler;
        const host = (_a = options.host) !== null && _a !== void 0 ? _a : '0.0.0.0';
        this.options = {
            ...options,
            rejectInvalidRequests: (_b = options.rejectInvalidRequests) !== null && _b !== void 0 ? _b : true,
            websocketPingInterval: 30000,
            websocketAuthorizer: (_c = options.websocketAuthorizer) !== null && _c !== void 0 ? _c : (() => true),
        };
        debug('creating central system on port %d - options: %o', port, this.options);
        this.httpServer = http_1.createServer();
        const httpDebug = debug.extend('http');
        this.httpServer.on('connection', socket => {
            httpDebug('new http connection');
            socket.on('data', data => {
                var _a;
                httpDebug('http connection received data:\n%s', data.toString('ascii'));
                if (options.onRawSocketData)
                    (_a = options.onRawSocketData) === null || _a === void 0 ? void 0 : _a.call(options, data);
            });
        });
        this.httpServer.listen(port, host);
        this.soapServer = this.setupSoapServer();
        this.websocketsServer = this.setupWebsocketsServer();
    }
    addConnectionListener(listener) {
        this.listeners.push(listener);
    }
    close() {
        const httpClosing = new Promise(resolve => this.httpServer.close(resolve));
        const wsClosing = new Promise(resolve => this.websocketsServer.close(resolve));
        return Promise.all([httpClosing, wsClosing]).then(() => { });
    }
    sendRequest(args) {
        return purify_ts_1.EitherAsync.fromPromise(async () => {
            var _a, _b;
            const { chargePointId, payload, action } = args;
            const cpDebug = debug.extend(chargePointId);
            if (!chargePointId)
                return purify_ts_1.Left(new errors_1.OCPPRequestError('charge point id was not provided'));
            // @ts-ignore - TS somehow doesn't understand that this is right
            const request = { ...payload, action, ocppVersion: args.ocppVersion };
            cpDebug('sending request: %o', request);
            switch (args.ocppVersion) {
                case 'v1.6-json': {
                    // get the first available connection of this chargepoint
                    cpDebug('getting connection from list of %d connections', (_a = this.connections[chargePointId]) === null || _a === void 0 ? void 0 : _a.length);
                    const [connection] = (_b = this.connections[args.chargePointId]) !== null && _b !== void 0 ? _b : [];
                    if (!connection) {
                        cpDebug('no connection found, rejecting request');
                        return purify_ts_1.Left(new errors_1.OCPPRequestError('there is no connection to this charge point'));
                    }
                    return connection
                        .sendRequest(action, request);
                }
                case 'v1.5-soap': {
                    const connection = await connection_1.default.connect(args.chargePointUrl, 'cp', args.chargePointId);
                    return connection.
                        sendRequest(action, request);
                }
            }
        });
    }
    /** @internal */
    setupSoapServer() {
        const services = {
            CentralSystemService: {
                CentralSystemServiceSoap12: Object.fromEntries(cp_1.chargePointActions.map(action => [action, this.getSoapHandler(action)]))
            }
        };
        const xml = fs.readFileSync(path.resolve(__dirname, '../messages/soap/ocpp_centralsystemservice_1.5_final.wsdl'), 'utf8');
        const server = soap.listen(this.httpServer, {
            services,
            path: '/',
            xml,
            forceSoap12Headers: true,
        });
        server.log = (type, data) => {
            var _a, _b;
            if (type === 'received' || type === 'replied') {
                (_b = (_a = this.options).onRawSoapData) === null || _b === void 0 ? void 0 : _b.call(_a, type, data);
            }
        };
        // makes headers case insensitive(lowercase)
        const normalizeHeaders = (headers) => Object.entries(headers).reduce((acc, [key, val]) => (acc[key.toLowerCase()] = val, acc), {});
        server.addSoapHeader((action, args, headers) => ({
            'Action': '/' + action + 'Response',
            'MessageID': uuid.v4(),
            'RelatesTo': normalizeHeaders(headers).messageid,
        }), '', 'wsa5', 'http://www.w3.org/2005/08/addressing');
        return server;
    }
    /** @internal */
    setupWebsocketsServer() {
        const server = new ws_1.default.Server({ handleProtocols, noServer: true });
        server.on('error', (error) => {
            debug('websocket error: %s', error.message);
        });
        server.on('upgrade', (request, _socket, _head) => {
            debug('websocket upgrade: %s', request.url);
        });
        server.on('connection', (socket, _request, metadata) => this.handleConnection(socket, metadata));
        /** validate all pre-requisites before upgrading the websocket connection */
        this.httpServer.on('upgrade', async (httpRequest, socket, head) => {
            var _a;
            debug('websocket upgrade: %s', httpRequest.url);
            if (!httpRequest.headers['sec-websocket-protocol']) {
                debug('websocket upgrade: no websocket protocol header, rejecting connection');
                socket.destroy();
                return;
            }
            const chargePointId = (_a = httpRequest.url) === null || _a === void 0 ? void 0 : _a.split('/').pop();
            if (!chargePointId) {
                debug('websocket upgrade: no charge point id(original url: %s), rejecting connection', httpRequest.url);
                socket.destroy();
                return;
            }
            const cpDebug = debug.extend(chargePointId);
            const metadata = { chargePointId, httpRequest };
            try {
                cpDebug('websocket upgrade: authorizing connection');
                const authorized = await this.options.websocketAuthorizer(metadata);
                cpDebug('websocket upgrade: authorization result: %s', authorized);
                if (!authorized)
                    throw new Error('not authorized');
            }
            catch (error) {
                cpDebug('websocket upgrade: authorization error: %s', error.message);
                socket.destroy();
                return;
            }
            server.handleUpgrade(httpRequest, socket, head, function done(socket) {
                cpDebug('websocket upgrade: connection established');
                server.emit('connection', socket, httpRequest, metadata);
            });
        });
        return server;
    }
    /** @internal */
    getSoapHandler(action) {
        return async (request, respond, headers, httpRequest) => {
            const chargePointId = headers.chargeBoxIdentity;
            if (!chargePointId)
                throw new errors_1.OCPPRequestError('No charge box identity was passed', 'GenericError');
            const response = await this.cpHandler({ action, ocppVersion: 'v1.5-soap', ...request }, {
                chargePointId,
                httpRequest,
            });
            if (!response)
                throw new errors_1.OCPPRequestError('Could not answer request', 'InternalError');
            const { action: _, ocppVersion: __, ...responsePayload } = response;
            respond === null || respond === void 0 ? void 0 : respond(responsePayload);
        };
    }
    /** @internal */
    async handleConnection(socket, metadata) {
        const { chargePointId } = metadata;
        const cpDebug = debug.extend(chargePointId);
        cpDebug('websocket connection: handling connection');
        this.listeners.forEach((f) => f(chargePointId, 'connected'));
        let isAlive = true;
        socket.on('pong', () => {
            cpDebug('websocket connection: received pong');
            isAlive = true;
        });
        function noop() { }
        const pingInterval = setInterval(() => {
            if (isAlive === false) {
                cpDebug('websocket connection: connection is dead, closing');
                return socket.terminate();
            }
            isAlive = false;
            cpDebug('websocket connection: sending ping');
            socket.ping(noop);
        }, this.options.websocketPingInterval);
        const connection = new ws_2.Connection(socket, 
        // @ts-ignore, TS is not good with dependent typing, it doesn't realize that the function
        // returns OCPP v1.6 responses when the request is a OCPP v1.6 request
        (request, validationError) => this.cpHandler(request, { ...metadata, validationError }), cp_1.chargePointActions, cs_1.centralSystemActions, this.options.rejectInvalidRequests, {
            onReceiveRequest: message => { var _a, _b; return (_b = (_a = this.options).onWebsocketRequestResponse) === null || _b === void 0 ? void 0 : _b.call(_a, 'chargepoint', 'request', message, metadata); },
            onSendResponse: message => { var _a, _b; return (_b = (_a = this.options).onWebsocketRequestResponse) === null || _b === void 0 ? void 0 : _b.call(_a, 'chargepoint', 'response', message, metadata); },
            onReceiveResponse: message => { var _a, _b; return (_b = (_a = this.options).onWebsocketRequestResponse) === null || _b === void 0 ? void 0 : _b.call(_a, 'central-system', 'response', message, metadata); },
            onSendRequest: message => { var _a, _b; return (_b = (_a = this.options).onWebsocketRequestResponse) === null || _b === void 0 ? void 0 : _b.call(_a, 'central-system', 'request', message, metadata); },
        }, this.options.websocketRequestTimeout);
        if (!this.connections[chargePointId]) {
            cpDebug('websocket connection: creating new connection list entry');
            this.connections[chargePointId] = [];
        }
        else {
            cpDebug('websocket connection: adding to existing connection list entry(previous list length: %d)', this.connections[chargePointId].length);
        }
        this.connections[chargePointId].push(connection);
        socket.on('error', (error) => {
            var _a, _b;
            cpDebug('websocket connection: socket error: %s', error.message);
            (_b = (_a = this.options).onWebsocketError) === null || _b === void 0 ? void 0 : _b.call(_a, error, metadata);
        });
        socket.on('message', (data) => {
            var _a, _b;
            cpDebug('websocket connection: received message: %s', data);
            (_b = (_a = this.options).onRawWebsocketData) === null || _b === void 0 ? void 0 : _b.call(_a, data, metadata);
            connection.handleWebsocketData(data);
        });
        socket.on('close', () => {
            cpDebug('websocket connection: closing conection');
            const closedIndex = this.connections[chargePointId].findIndex(c => c === connection);
            this.connections[chargePointId].splice(closedIndex, 1);
            clearInterval(pingInterval);
            this.listeners.forEach((f) => f(chargePointId, 'disconnected'));
        });
    }
}
exports.default = CentralSystem;
//# sourceMappingURL=index.js.map