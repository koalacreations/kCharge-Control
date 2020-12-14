import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { Cell } from "../../models/Cell";

const get = async (request: Request, h: ResponseToolkit) => {
  const cell = await Cell.findOne(request.params.id);

  if (!cell) throw Boom.notFound();

  return cell;
};

const remove = async (request: Request, h: ResponseToolkit) => {
  const cell = await Cell.findOne(request.params.id);
  if (!cell) throw Boom.notFound();

  cell.softRemove();
  return cell;
};

export default { get, remove };
