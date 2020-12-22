import Boom from "@hapi/boom";
import { Cell } from "../../models/Cell";

const get = async () => {
  const cell = await Cell.find();

  return cell;
};

const post = async (request: any) => {
  const cell = await Cell.findOne(request.payload.id);

  if (cell) throw Boom.conflict();

  const newCell = Cell.create({
    id: request.payload.id,
    cellType: request.payload.type,
    state: Cell.CellState.New,
  });

  return newCell.save();
};

export default { get, post };
