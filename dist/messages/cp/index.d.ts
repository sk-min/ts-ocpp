import { OCPPVersion, OCPPVersionV15, OCPPVersionV16 } from '../../types';
import JSONChargePointMessage from './json';
import SOAPChargePointMessage from './soap';
declare type ChargePointMessage<V extends OCPPVersion = OCPPVersion> = V extends OCPPVersionV16 ? JSONChargePointMessage : V extends OCPPVersionV15 ? SOAPChargePointMessage : never;
export declare type ChargePointAction<V extends OCPPVersion = OCPPVersion> = keyof ChargePointMessage<V>;
export declare const chargePointActions: ChargePointAction[];
export declare type ChargePointRequest<V extends OCPPVersion, T extends ChargePointAction> = ChargePointMessage<V>[T]['request'];
export declare type ChargePointResponse<V extends OCPPVersion, T extends ChargePointAction> = ChargePointMessage<V>[T]['response'];
export default ChargePointMessage;
