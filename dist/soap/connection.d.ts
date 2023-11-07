import { ActionName, Request, Response } from '../messages';
import { OCPPRequestError } from '../errors/index';
import { EitherAsync } from 'purify-ts';
import * as soap from 'soap';
export default class SOAPConnection {
    private readonly soapClient;
    private readonly connectedTo;
    private readonly chargePointId;
    private readonly endpoint;
    private respondedActions;
    constructor(soapClient: soap.Client, connectedTo: 'cp' | 'cs', chargePointId: string, endpoint: string);
    static connect(endpoint: string, connectedTo: 'cp' | 'cs', chargePointId: string): Promise<SOAPConnection>;
    sendRequest<T extends ActionName<'v1.5-soap'>>(action: T, { action: _, ocppVersion: __, ...payload }: Request<T, 'v1.5-soap'>): EitherAsync<OCPPRequestError, Response<T, 'v1.5-soap'>>;
}
