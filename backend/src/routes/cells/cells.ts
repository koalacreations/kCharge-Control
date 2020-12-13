import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { Cell } from "../../models/Cell";

const get = async (request: Request, h: ResponseToolkit) => {
  const cell = await Cell.find();

  return cell;
};

const post = async (request: any, h: ResponseToolkit) => {
  const cell = await Cell.findOne(request.payload.id);

  if (cell) throw Boom.conflict();

  const newCell = Cell.create(
    {
      id: request.payload.id,
      type: request.payload.type,
      state: Cell.CellState.New,
    },
  );

  return newCell.save();
};

export default { get, post };
