import WebSocket from 'ws';
import { ActionName } from '../messages';
export declare type OCPPJRawMessage = WebSocket.Data;
export declare type ErrorCode = 'NotImplemented' | 'NotSupported' | 'InternalError' | 'ProtocolError' | 'SecurityError' | 'FormationViolation' | 'PropertyConstraintViolation' | 'OccurenceConstraintViolation' | 'TypeConstraintViolation' | 'GenericError';
export declare enum MessageType {
    CALL = 2,
    CALLRESULT = 3,
    CALLERROR = 4
}
export declare type OCPPJMessage = {
    id: string;
} & ({
    type: MessageType.CALL;
    action: ActionName<'v1.6-json'>;
    payload?: object;
} | {
    type: MessageType.CALLRESULT;
    payload?: object;
} | {
    type: MessageType.CALLERROR;
    errorCode: ErrorCode;
    errorDescription: string;
    errorDetails?: object;
});
