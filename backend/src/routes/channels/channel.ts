import { Request } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { DeviceChannel } from "../../models/DeviceChannel";
import { Cell } from "../../models/Cell";

const get = async (request: Request) => {
  const channel = await DeviceChannel.findOne(request.params.id);

  if (!channel) throw Boom.notFound();

  return channel;
};

const put = async (request: Request) => {
  const channel = await DeviceChannel.findOne(request.params.id);
  const payload = request.payload as {cellId: string};

  if (!channel) throw Boom.notFound();

  const cell = await Cell.findOne(payload.cellId);

  if (!cell) throw Boom.badRequest();

  channel.cell = cell;
  channel.save();

  return { success: true };
};

export default { get, put };
