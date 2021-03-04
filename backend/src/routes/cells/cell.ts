import { Request } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { Cell, ICell } from "../../models/Cell";

const get = async (request: Request) => {
  const cell = await Cell.findOne(request.params.id);

  if (!cell) throw Boom.notFound();

  return cell;
};

const put = async (request: Request) => {
  const cell = await Cell.findOne(request.params.id.replace(/^0+(?=\d)/, ""));

  if (!cell) throw Boom.notFound();

  const cellPayload = request.payload as ICell;

  cell.class = cellPayload.class;
  cell.state = (<any>Cell.CellState)[cellPayload.state];
  cell.save();

  return cell;
};

const remove = async (request: Request) => {
  const cell = await Cell.findOne(request.params.id);
  if (!cell) throw Boom.notFound();

  cell.softRemove();
  return cell;
};

export default { get, put, remove };
