import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { Cell } from "../../models/Cell";
import { CellType } from "../../models/CellType";

const get = async (request: Request, h: ResponseToolkit) => {
  const cell = await Cell.find();

  return cell;
};

const post = async (request: any, h: ResponseToolkit) => {
  const cell = await Cell.findOne(request.payload.id);
  if (cell) throw Boom.conflict();

  let cellType = await CellType.findOne(request.payload.type);
  if (!cellType) {
    cellType = await CellType.create({
      id: request.payload.type,
      name: request.payload.type,
    }).save();
  }

  const newCell = await Cell.create(
    {
      id: request.payload.id,
      cellType,
      state: Cell.CellState.New,
      class: Cell.CellClass.Normal,
    },
  ).save();

  return h.response(newCell).code(201);
};

export default { get, post };
