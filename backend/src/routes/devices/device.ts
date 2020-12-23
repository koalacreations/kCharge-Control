import { Request } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { Device } from "../../models/Device";

const get = async (request: Request) => {
  const cell = await Device.findOne(request.params.id);

  if (!cell) throw Boom.notFound();

  return cell;
};

export default { get };
