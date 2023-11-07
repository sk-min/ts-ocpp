import WebSocket from 'ws';
import { OCPPJMessage } from './types';
import { ActionName, Request, RequestHandler, Response } from '../messages';
import { OCPPRequestError, ValidationError } from '../errors/index';
import { EitherAsync } from 'purify-ts';
export default class Connection<ReqAction extends ActionName<'v1.6-json'>> {
    readonly socket: WebSocket;
    private readonly requestHandler;
    private readonly requestedActions;
    private readonly respondedActions;
    private readonly rejectInvalidRequests;
    private readonly handlers?;
    private readonly requestTimeout?;
    private messageTriggers;
    constructor(socket: WebSocket, requestHandler: RequestHandler<ReqAction, ValidationError | undefined, 'v1.6-json'>, requestedActions: ReqAction[], respondedActions: ActionName<'v1.6-json'>[], rejectInvalidRequests?: boolean, handlers?: {
        onReceiveRequest: (m: OCPPJMessage) => void;
        onSendResponse: (m: OCPPJMessage) => void;
        onSendRequest: (m: OCPPJMessage) => void;
        onReceiveResponse: (m: OCPPJMessage) => void;
    } | undefined, requestTimeout?: number | undefined);
    sendRequest<T extends ActionName<'v1.6-json'>>(action: T, { action: _, ocppVersion: __, ...payload }: Request<T, 'v1.6-json'>): EitherAsync<OCPPRequestError, Response<T, 'v1.6-json'>>;
    handleWebsocketData(data: WebSocket.Data): void;
    close(): void;
    private sendOCPPMessage;
    private handleOCPPMessage;
}
