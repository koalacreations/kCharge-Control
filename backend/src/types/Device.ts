import { DeviceChannel } from "../models/DeviceChannel";

export interface IDevice {
  id: number;
  deviceName: string | null;
  deviceManufacturer: string | null;
  deviceModel: string | null;
  connected: boolean;
  capabilities: {
    channels: number;
    charge: boolean;
    discharge: boolean;
    configurableChargeCurrent: boolean;
    configurableDischargeCurrent: boolean;
    configurableChargeVoltage: boolean;
    configurableDischargeVoltage: boolean;
  };
  deviceChannels: DeviceChannel[];
}

export interface IDeviceStatus extends IDevice {
  channels: DeviceChannel.IDeviceChannel[]
}

export default class Device implements IDevice {
  constructor() {
    this.id = 0;
    this.deviceName = null;
    this.deviceManufacturer = null;
    this.deviceModel = null;
    this.connected = false;
    this.capabilities = {
      channels: 0,
      charge: false,
      discharge: false,
      configurableChargeCurrent: false,
      configurableDischargeCurrent: false,
      configurableChargeVoltage: false,
      configurableDischargeVoltage: false,
    };
    this.deviceChannels = [];
  }

  id: number;

  deviceName: string | null;

  deviceManufacturer: string | null;

  deviceModel: string | null;

  connected: boolean;

  capabilities: {
    channels: number;
    charge: boolean;
    discharge: boolean;
    configurableChargeCurrent: boolean;
    configurableDischargeCurrent: boolean;
    configurableChargeVoltage: boolean;
    configurableDischargeVoltage: boolean;
  };

  deviceChannels: DeviceChannel[];
}
