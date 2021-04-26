import { IPayloadDeviceStatus } from "../../types";
import { Device } from "../../../models/Device";
import { DeviceChannel } from "../../../models/DeviceChannel";

export default async function DeviceStatus(payload: IPayloadDeviceStatus, deviceId: string) {
  const device = await Device.findOne(deviceId);

  if (device) {
    payload.channels.forEach(async (channel) => {
      const channelEntity = await DeviceChannel.findOne({
        where: { channelId: channel.id, device: device.id }
      });
      if (!channelEntity) {
        console.log(`Warning!! No channelEntity found for ${channel.id} on device: ${device.id}.`);
        return;
      } // this means we likely haven't finished adding the device yet
      channelEntity.voltage = channel.voltage;
      channelEntity.current = channel.current;
      channelEntity.temperature = channel.temperature;
      channelEntity.state = (channel.state as DeviceChannel.DeviceChannelState);
      channelEntity.stage = channel.stage;
      channelEntity.capacity = channel.capacity;
      channelEntity.save();
    });
  }
}
