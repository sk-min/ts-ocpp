import { Request, RequestHandler, Response } from '../messages';
import { CentralSystemAction } from '../messages/cs';
import { Connection } from '../ws';
import { ChargePointAction } from '../messages/cp';
import { EitherAsync } from 'purify-ts';
import { OCPPRequestError, ValidationError } from '../errors';
import { OCPPVersion } from '../types';
export declare type CPSendRequestArgs<T extends ChargePointAction<V>, V extends OCPPVersion> = {
    ocppVersion: 'v1.6-json';
    payload: Omit<Request<T, V>, 'action' | 'ocppVersion'>;
    action: T;
};
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
export default class ChargePoint {
    readonly id: string;
    private readonly requestHandler;
    private readonly csUrl;
    private connection?;
    constructor(id: string, requestHandler: RequestHandler<CentralSystemAction<'v1.6-json'>, ValidationError | undefined, 'v1.6-json'>, csUrl: string);
    connect(): Promise<Connection<CentralSystemAction<'v1.6-json'>>>;
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
    sendRequest<T extends ChargePointAction>(args: CPSendRequestArgs<T, 'v1.6-json'>): EitherAsync<OCPPRequestError, Response<T>>;
    close(): void;
}
