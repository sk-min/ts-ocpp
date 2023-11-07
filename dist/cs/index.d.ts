/// <reference types="node" />
/**
 * Sets up a central system, that can communicate with charge points
 */
import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { Request, RequestHandler, Response } from '../messages';
import { ChargePointAction } from '../messages/cp';
import { OCPPJMessage } from '../ws';
import { CentralSystemAction } from '../messages/cs';
import { OCPPRequestError, ValidationError } from '../errors';
import { EitherAsync } from 'purify-ts';
import { OCPPVersion } from '../types';
declare type ConnectionListener = (cpId: string, status: 'disconnected' | 'connected') => void;
export declare type RequestMetadata = {
    chargePointId: string;
    httpRequest: IncomingMessage;
    validationError?: ValidationError;
};
export declare type WebsocketRequestResponseListener = (initiator: 'chargepoint' | 'central-system', type: 'request' | 'response', data: OCPPJMessage, metadata: Omit<RequestMetadata, 'validationError'>) => void;
export declare type CSSendRequestArgs<T extends CentralSystemAction<V>, V extends OCPPVersion> = {
    ocppVersion: 'v1.6-json';
    chargePointId: string;
    payload: Omit<Request<T, V>, 'action' | 'ocppVersion'>;
    action: T;
} | {
    ocppVersion: 'v1.5-soap';
    chargePointUrl: string;
    chargePointId: string;
    payload: Omit<Request<T, V>, 'action' | 'ocppVersion'>;
    action: T;
};
export declare type CentralSystemOptions = {
    /** if the chargepoint sends an invalid request(in ocpp v1.6), we can still forward it to the handler */
    rejectInvalidRequests?: boolean;
    /** default is 0.0.0.0 */
    host?: string;
    /**
     * can be used to log exactly what the chargepoint sends to this central system without any processing
     * @example
     * onRawSocketData: (data) => console.log(data.toString('ascii'))
     **/
    onRawSocketData?: (data: Buffer) => void;
    onRawSoapData?: (type: 'replied' | 'received', data: string) => void;
    onRawWebsocketData?: (data: WebSocket.Data, metadata: Omit<RequestMetadata, 'validationError'>) => void;
    onWebsocketRequestResponse?: WebsocketRequestResponseListener;
    onWebsocketError?: (error: Error, metadata: Omit<RequestMetadata, 'validationError'>) => void;
    /** in milliseconds */
    websocketPingInterval?: number;
    websocketRequestTimeout?: number;
    /** can be used to authorize websockets before the socket formation */
    websocketAuthorizer?: (metadata: RequestMetadata) => Promise<boolean> | boolean;
};
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
export default class CentralSystem {
    private cpHandler;
    /** each chargepoint has a list of connections because there is an
     * issue with some chargers that do not fully close the previous websocket connection
     * after creating a new websocket connection, with this we can still keep track of all
     * current opened sockets, and only remove the connections whose sockets have closed.
     *
     * (for more info: see the test "if two sockets open before the first one closing, should still remain the latest socket") */
    private connections;
    private listeners;
    private websocketsServer;
    private soapServer;
    private httpServer;
    private options;
    constructor(port: number, cpHandler: RequestHandler<ChargePointAction, RequestMetadata>, options?: CentralSystemOptions);
    addConnectionListener(listener: ConnectionListener): void;
    close(): Promise<void>;
    sendRequest<V extends OCPPVersion, T extends CentralSystemAction>(args: CSSendRequestArgs<T, V>): EitherAsync<OCPPRequestError, Response<T, V>>;
}
export {};
