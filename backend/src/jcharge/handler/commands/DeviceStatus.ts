import { IPayloadDeviceStatus } from "../../types";
import { Device } from "../../../models/Device";
import { DeviceChannel } from "../../../models/DeviceChannel";

export default async function DeviceStatus(payload: IPayloadDeviceStatus, deviceId: string) {
  const device = await Device.findOne(deviceId);

  if (device) {
    payload.channels.forEach(async (channel) => {
      const channelEntity = await DeviceChannel.findOne({
        where: { id: channel.id, device: device.id }
      });
      channelEntity.voltage = channel.voltage;
      channelEntity.current = channel.current;
      channelEntity.temperature = channel.temperature;
      channelEntity.state = (channel.state as DeviceChannel.DeviceChannelState);
      channelEntity.stage = channel.stage;
      channelEntity.save();
    });
  }
}
