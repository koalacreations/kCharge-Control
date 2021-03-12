import Chalk from "chalk";
import { IPayloadDeviceStatus } from "../../types";
import { Device } from "../../../models/Device";

export default async function DeviceStatus(payload: IPayloadDeviceStatus, deviceId: string) {
  const device = await Device.findOne(deviceId);

  if (device) {
    console.log(Chalk.blue(`Got device update from: ${device.deviceModel}`));

    // TODO: implement
  }
}
