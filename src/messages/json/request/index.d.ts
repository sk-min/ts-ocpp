/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface AuthorizeRequest {
  idTag: string;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface BootNotificationRequest {
  chargePointVendor: string;
  chargePointModel: string;
  chargePointSerialNumber?: string;
  chargeBoxSerialNumber?: string;
  firmwareVersion?: string;
  iccid?: string;
  imsi?: string;
  meterType?: string;
  meterSerialNumber?: string;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface CancelReservationRequest {
  reservationId: number;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ChangeAvailabilityRequest {
  connectorId: number;
  type: "Inoperative" | "Operative";
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ChangeConfigurationRequest {
  key: string;
  value: string;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ClearCacheRequest {}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ClearChargingProfileRequest {
  id?: number;
  connectorId?: number;
  chargingProfilePurpose?: "ChargePointMaxProfile" | "TxDefaultProfile" | "TxProfile";
  stackLevel?: number;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface DataTransferRequest {
  vendorId: string;
  messageId?: string;
  data?: string;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface DiagnosticsStatusNotificationRequest {
  status: "Idle" | "Uploaded" | "UploadFailed" | "Uploading";
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface FirmwareStatusNotificationRequest {
  status: "Downloaded" | "DownloadFailed" | "Downloading" | "Idle" | "InstallationFailed" | "Installing" | "Installed";
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GetCompositeScheduleRequest {
  connectorId: number;
  duration: number;
  chargingRateUnit?: "A" | "W";
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GetConfigurationRequest {
  key?: string[];
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GetDiagnosticsRequest {
  location: string;
  retries?: number;
  retryInterval?: number;
  startTime?: string;
  stopTime?: string;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GetLocalListVersionRequest {}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface HeartbeatRequest {}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface MeterValuesRequest {
  connectorId: number;
  transactionId?: number;
  meterValue: {
    timestamp: string;
    sampledValue: {
      value: string;
      context?: "Interruption.Begin" | "Interruption.End" | "Sample.Clock" | "Sample.Periodic" | "Transaction.Begin" | "Transaction.End" | "Trigger" | "Other";
      format?: "Raw" | "SignedData";
      measurand?:
        | "Energy.Active.Export.Register"
        | "Energy.Active.Import.Register"
        | "Energy.Reactive.Export.Register"
        | "Energy.Reactive.Import.Register"
        | "Energy.Active.Export.Interval"
        | "Energy.Active.Import.Interval"
        | "Energy.Reactive.Export.Interval"
        | "Energy.Reactive.Import.Interval"
        | "Power.Active.Export"
        | "Power.Active.Import"
        | "Power.Offered"
        | "Power.Reactive.Export"
        | "Power.Reactive.Import"
        | "Power.Factor"
        | "Current.Import"
        | "Current.Export"
        | "Current.Offered"
        | "Voltage"
        | "Frequency"
        | "Temperature"
        | "SoC"
        | "RPM";
      phase?: "L1" | "L2" | "L3" | "N" | "L1-N" | "L2-N" | "L3-N" | "L1-L2" | "L2-L3" | "L3-L1";
      location?: "Cable" | "EV" | "Inlet" | "Outlet" | "Body";
      unit?: "Wh" | "kWh" | "varh" | "kvarh" | "W" | "kW" | "VA" | "kVA" | "var" | "kvar" | "A" | "V" | "K" | "Celcius" | "Fahrenheit" | "Percent" | "C";
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  }[];
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface RemoteStartTransactionRequest {
  connectorId?: number;
  idTag: string;
  chargingProfile?: {
    chargingProfileId: number;
    transactionId?: number;
    stackLevel: number;
    chargingProfilePurpose: "ChargePointMaxProfile" | "TxDefaultProfile" | "TxProfile";
    chargingProfileKind: "Absolute" | "Recurring" | "Relative";
    recurrencyKind?: "Daily" | "Weekly";
    validFrom?: string;
    validTo?: string;
    chargingSchedule: {
      duration?: number;
      startSchedule?: string;
      chargingRateUnit: "A" | "W";
      chargingSchedulePeriod: {
        startPeriod: number;
        limit: number;
        numberPhases?: number;
        [k: string]: unknown;
      }[];
      minChargingRate?: number;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface RemoteStopTransactionRequest {
  transactionId: number;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ReserveNowRequest {
  connectorId: number;
  expiryDate: string;
  idTag: string;
  parentIdTag?: string;
  reservationId: number;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ResetRequest {
  type: "Hard" | "Soft";
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface SendLocalListRequest {
  listVersion: number;
  localAuthorizationList?: {
    idTag: string;
    idTagInfo?: {
      status: "Accepted" | "Blocked" | "Expired" | "Invalid" | "ConcurrentTx";
      [k: string]: unknown;
    };
    [k: string]: unknown;
  }[];
  updateType: "Differential" | "Full";
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface SetChargingProfileRequest {
  connectorId: number;
  csChargingProfiles: {
    chargingProfileId: number;
    transactionId?: number;
    stackLevel: number;
    chargingProfilePurpose: "ChargePointMaxProfile" | "TxDefaultProfile" | "TxProfile";
    chargingProfileKind: "Absolute" | "Recurring" | "Relative";
    recurrencyKind?: "Daily" | "Weekly";
    validFrom?: string;
    validTo?: string;
    chargingSchedule: {
      duration?: number;
      startSchedule?: string;
      chargingRateUnit: "A" | "W";
      chargingSchedulePeriod: {
        startPeriod: number;
        limit: number;
        numberPhases?: number;
        [k: string]: unknown;
      }[];
      minChargingRate?: number;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface StartTransactionRequest {
  connectorId: number;
  idTag: string;
  meterStart: number;
  reservationId?: number;
  timestamp: string;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface StatusNotificationRequest {
  connectorId: number;
  errorCode:
    | "ConnectorLockFailure"
    | "EVCommunicationError"
    | "GroundFailure"
    | "HighTemperature"
    | "InternalError"
    | "LocalListConflict"
    | "NoError"
    | "OtherError"
    | "OverCurrentFailure"
    | "PowerMeterFailure"
    | "PowerSwitchFailure"
    | "ReaderFailure"
    | "ResetFailure"
    | "UnderVoltage"
    | "OverVoltage"
    | "WeakSignal";
  info?: string;
  status: "Available" | "Preparing" | "Charging" | "SuspendedEVSE" | "SuspendedEV" | "Finishing" | "Reserved" | "Unavailable" | "Faulted";
  timestamp?: string;
  vendorId?: string;
  vendorErrorCode?: string;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface StopTransactionRequest {
  idTag?: string;
  meterStop: number;
  timestamp: string;
  transactionId: number;
  reason?: "EmergencyStop" | "EVDisconnected" | "HardReset" | "Local" | "Other" | "PowerLoss" | "Reboot" | "Remote" | "SoftReset" | "UnlockCommand" | "DeAuthorized";
  transactionData?: {
    timestamp: string;
    sampledValue: {
      value: string;
      context?: "Interruption.Begin" | "Interruption.End" | "Sample.Clock" | "Sample.Periodic" | "Transaction.Begin" | "Transaction.End" | "Trigger" | "Other";
      format?: "Raw" | "SignedData";
      measurand?:
        | "Energy.Active.Export.Register"
        | "Energy.Active.Import.Register"
        | "Energy.Reactive.Export.Register"
        | "Energy.Reactive.Import.Register"
        | "Energy.Active.Export.Interval"
        | "Energy.Active.Import.Interval"
        | "Energy.Reactive.Export.Interval"
        | "Energy.Reactive.Import.Interval"
        | "Power.Active.Export"
        | "Power.Active.Import"
        | "Power.Offered"
        | "Power.Reactive.Export"
        | "Power.Reactive.Import"
        | "Power.Factor"
        | "Current.Import"
        | "Current.Export"
        | "Current.Offered"
        | "Voltage"
        | "Frequency"
        | "Temperature"
        | "SoC"
        | "RPM";
      phase?: "L1" | "L2" | "L3" | "N" | "L1-N" | "L2-N" | "L3-N" | "L1-L2" | "L2-L3" | "L3-L1";
      location?: "Cable" | "EV" | "Inlet" | "Outlet" | "Body";
      unit?: "Wh" | "kWh" | "varh" | "kvarh" | "W" | "kW" | "VA" | "kVA" | "var" | "kvar" | "A" | "V" | "K" | "Celcius" | "Fahrenheit" | "Percent" | "C";
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  }[];
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface TriggerMessageRequest {
  requestedMessage: "BootNotification" | "DiagnosticsStatusNotification" | "FirmwareStatusNotification" | "Heartbeat" | "MeterValues" | "StatusNotification";
  connectorId?: number;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface UnlockConnectorRequest {
  connectorId: number;
}
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface UpdateFirmwareRequest {
  location: string;
  retries?: number;
  retrieveDate: string;
  retryInterval?: number;
}
