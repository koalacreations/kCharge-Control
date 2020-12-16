import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { Cell, ICell } from "../../models/Cell";

const get = async (request: Request, h: ResponseToolkit) => {
  const cell = await Cell.findOne(request.params.id);

  if (!cell) throw Boom.notFound();

  console.log(cell);
  return cell;
};

const put = async (request: Request, h: ResponseToolkit) => {
  const cell = await Cell.findOne(request.params.id);
  console.log("yolo");
  console.log(request.params.id);

  if (!cell) throw Boom.notFound();

  const cellPayload = request.payload as ICell;

  cell.class = cellPayload.class;
  cell.save();

  return cell;
};

const remove = async (request: Request, h: ResponseToolkit) => {
  const cell = await Cell.findOne(request.params.id);
  if (!cell) throw Boom.notFound();

  cell.softRemove();
  return cell;
};

export default { get, put, remove };
