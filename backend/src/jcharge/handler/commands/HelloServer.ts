import Chalk from "chalk";
import { IPayloadHelloServer } from "../../types";
import { Device } from "../../../models/Device";

export default async function HelloServer(payload: IPayloadHelloServer) {
  let device = await Device.findOne(payload.id);

  if (!device) {
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
  }
}
