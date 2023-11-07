import { OCPPVersion } from '../types';
import ChargePointMessage, { ChargePointAction } from './cp';
import CentralSystemMessage, { CentralSystemAction } from './cs';
export declare type ActionName<V extends OCPPVersion = OCPPVersion> = ChargePointAction<V> | CentralSystemAction<V>;
declare type ReqRes<T extends ActionName<V>, V extends OCPPVersion = OCPPVersion> = T extends ChargePointAction<V> ? ChargePointMessage<V>[T] : T extends CentralSystemAction<V> ? CentralSystemMessage<V>[T] : never;
/**
 * @example
 * import { Request } from '@voltbras/ts-ocpp';
 *
 * type ChargeRelatedRequest = Request<'StartTransaction' | 'StopTransaction'>;
 *
 * @category Message Type
 */ export declare type Request<T extends ActionName<V>, V extends OCPPVersion = OCPPVersion> = ReqRes<T, V>['request'];
/**
 * @example
 * import { Response } from '@voltbras/ts-ocpp';
 *
 * type ChargeRelatedResponse = Response<'StartTransaction' | 'StopTransaction'>;
 *
 * @category Message Type
 */ export declare type Response<T extends ActionName<V>, V extends OCPPVersion = OCPPVersion> = ReqRes<T, V>['response'];
declare type Result<T> = Promise<T> | T;
/**
 * TS is still not very good with dependent-typing
 * (i.e. making the return type differ on the input type)
 * so when using this it is advisable to do type assertions.
 *
 * @category Handler
 */
export declare type RequestHandler<T extends ActionName<V>, Metadata = undefined, V extends OCPPVersion = OCPPVersion> = (request: Request<T, V>, extra: Metadata) => Result<Response<T, V>>;
export {};
