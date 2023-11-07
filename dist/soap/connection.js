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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../errors/index");
const validation_1 = require("../messages/validation");
const purify_ts_1 = require("purify-ts");
const soap = __importStar(require("soap"));
const path = __importStar(require("path"));
const cp_1 = require("../messages/cp");
const cs_1 = require("../messages/cs");
const uuid = __importStar(require("uuid"));
class SOAPConnection {
    constructor(soapClient, connectedTo, chargePointId, endpoint) {
        this.soapClient = soapClient;
        this.connectedTo = connectedTo;
        this.chargePointId = chargePointId;
        this.endpoint = endpoint;
        this.respondedActions = connectedTo === 'cp' ? cs_1.soapCentralSystemActions : cp_1.chargePointActions;
    }
    static async connect(endpoint, connectedTo, chargePointId) {
        const wsdlPath = path.resolve(__dirname, (connectedTo === 'cs'
            ? '../messages/soap/ocpp_centralsystemservice_1.5_final.wsdl'
            : '../messages/soap/ocpp_chargepointservice_1.5_final.wsdl'));
        const soapClient = await soap.createClientAsync(wsdlPath, { endpoint, forceSoap12Headers: true });
        return new SOAPConnection(soapClient, connectedTo, chargePointId, endpoint);
    }
    sendRequest(action, { action: _, ocppVersion: __, ...payload }) {
        return purify_ts_1.EitherAsync.fromPromise(async () => {
            const validateResult = validation_1.validateMessageRequest(action, payload, this.respondedActions);
            if (validateResult.isLeft())
                return purify_ts_1.Left(new index_1.OCPPApplicationError(validateResult.extract().toString()));
            const xmlNs = this.connectedTo === 'cp' ? 'urn://Ocpp/Cp/2012/06/' : 'urn://Ocpp/Cs/2012/06/';
            this.soapClient.addSoapHeader({ chargeBoxIdentity: this.chargePointId }, '', 'ocpp', xmlNs);
            this.soapClient.addSoapHeader({
                'Action': '/' + action,
                'MessageID': uuid.v4(),
                'To': this.endpoint,
            }, '', 'wsa5', 'http://www.w3.org/2005/08/addressing');
            const [err, result, _rawResponse, _soapHeader, _rawRequest] = await new Promise(resolve => {
                const [serviceKey, portKey] = this.connectedTo === 'cp'
                    ? ['ChargePointService', 'ChargePointServiceSoap12']
                    : ['CentralSystemService', 'CentralSystemServiceSoap12'];
                this.soapClient[serviceKey][portKey][action](payload, (...args) => resolve(args));
            });
            if (err)
                return purify_ts_1.Left(new index_1.OCPPRequestError(err.toString()));
            return purify_ts_1.Right(result);
        });
    }
}
exports.default = SOAPConnection;
//# sourceMappingURL=connection.js.map