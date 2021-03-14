export interface IPacket {
  version: number;
  command: string;
  deviceId: string;
  payload: object;
}

export interface IPayloadHello {
  serverHost: string;
  time: number;
  serverName: string;
}

export interface IPayloadHelloServer {
  id: string;
  deviceName: string | null;
  deviceManufacturer: string | null;
  deviceModel: string | null;
  capabilities: {
    channels: number;
    charge: boolean;
    discharge: boolean;
    configurableChargeCurrent: boolean;
    configurableDischargeCurrent: boolean;
    configurableChargeVoltage: boolean;
    configurableDischargeVoltage: boolean;
  };
}

export type IChannelState = "empty"
        | "idle"
        | "charging"
        | "discharging"
        | "overVoltage"
        | "underVoltage"
        | "overTemperature"
        | "error";

export interface IChannelStatus {
      id: number;
      state: IChannelState;
      stage: string;
      current: number;
      voltage: number;
      temperature: number;
      capacity: number;
    }

export interface IPayloadDeviceStatus {
  channels: IChannelStatus[];
}

interface ChargeOrDischarge {
  channel: number;
  startVoltage: number;
  endVoltage: number;
  startTemperature: number | null;
  endTemperature: number | null;
  capacity: number;
  dcResistance: number | null;
  acResistance: number | null;
  data: [
    {
      time: number;
      voltage: number;
      current: number;
      capacity: number;
      temperature: number;
    }
  ];
}

export interface IPayloadDischargeComplete extends ChargeOrDischarge {}
export interface IPayloadChargeComplete extends ChargeOrDischarge {}

export interface IPayloadResistanceComplete {
  channel: number;
  dcResistance: number | null;
  acResistance: number | null;
}

export interface IPayloadStartAction {
  channel: number;
  action: "charge" | "discharge" | "dcResistance" | "acResistance";
  rate: number | null;
  cutoffVoltage: number | null;
}

interface ChannelPayload {
  channel: number;
}

export interface IPayloadStopAction extends ChannelPayload {}
export interface IPayloadLocateChannel extends ChannelPayload {}
export interface IPayloadReportLocateChannel extends ChannelPayload {}

export interface IPayloadReportMessage {
  type: "error" | "warning" | "info";
  message: string;
}

export interface IPayloadResetDevice {
  type: "powerCycle" | "factoryReset";
}

export interface IPayloadSetConfiguration {
  configuration: object;
}
