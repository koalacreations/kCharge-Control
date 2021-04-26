import Chalk from "chalk";
import WebSocket from "ws";
import { IPayloadHelloServer } from "../../types";
import { Device } from "../../../models/Device";
import { DeviceChannel } from "../../../models/DeviceChannel";

export default async function HelloServer(payload: IPayloadHelloServer, ws: WebSocket) {
  let device = await Device.findOne(payload.id);

  if (!device) {
    // tslint:disable-next-line:no-console
    console.log(Chalk.blue(`Found new device: ${payload.id}`));
    const newDevice = Device.create({
      id: payload.id,
      deviceName: payload.deviceName || "",
      deviceManufacturer: payload.deviceManufacturer,
      deviceModel: payload.deviceModel,
      channels: payload.capabilities.channels,
      charge: payload.capabilities.charge,
      discharge: payload.capabilities.discharge,
      configurableChargeCurrent: payload.capabilities.configurableChargeCurrent,
      configurableDischargeCurrent:
        payload.capabilities.configurableDischargeCurrent,
      configurableChargeVoltage: payload.capabilities.configurableChargeVoltage,
    });

    device = await newDevice.save();

    for (let i = 1; i <= device.channels; i++) {
      DeviceChannel.create({
        channelId: i,
        state: DeviceChannel.DeviceChannelState.empty,
        current: 0,
        voltage: 0,
        temperature: 0,
        capacity: 0,
        device
      }).save();
    }
  } else {
    device.connected = true;
    device.save();
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    ws.deviceId = device.id;
  }
}
