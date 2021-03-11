import { DeviceChannel } from "../../models/DeviceChannel";
import { Cell } from "../../models/Cell";

const get = async () => {
  const channels = await DeviceChannel.find();

  // const cell = await Cell.findOne(1);
  // const ch = DeviceChannel.create({
  //   cell, channelId: 1, state: DeviceChannel.DeviceChannelState.empty, current: 0, voltage: 0
  // });

  // ch.save();

  return channels;
};

export default { get };
