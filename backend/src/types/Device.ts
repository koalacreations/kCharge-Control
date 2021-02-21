import { DeviceChannel } from "../models/DeviceChannel";

export interface IDevice {
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

export interface IDeviceStatus extends IDevice {
  channels: Array<DeviceChannel.IDeviceChannel>
}

export default class Device implements IDevice {
  constructor() {
    this.id = "";
    this.deviceName = null;
    this.deviceManufacturer = null;
    this.deviceModel = null;
    this.capabilities = {
      channels: 0,
      charge: false,
      discharge: false,
      configurableChargeCurrent: false,
      configurableDischargeCurrent: false,
      configurableChargeVoltage: false,
      configurableDischargeVoltage: false,
    };
  }

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
