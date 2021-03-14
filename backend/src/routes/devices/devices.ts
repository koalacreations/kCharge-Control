import { Device } from "../../models/Device";
import { DeviceChannel } from "../../models/DeviceChannel";

const get = async () => {
  const devices = await Device.find();

  const newDevices = await Promise.all(
    devices.map(async (device) => {
      const newDevice = device;
      newDevice.deviceChannels = await DeviceChannel.find({ where: { device: device.id } });
      return newDevice;
    })
  );

  console.log(newDevices[0].deviceChannels);
  return newDevices;
};

export default { get };
