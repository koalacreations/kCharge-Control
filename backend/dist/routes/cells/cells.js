"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const Cell_1 = require("../../models/Cell");
const CellType_1 = require("../../models/CellType");
const get = async () => {
    const cell = await Cell_1.Cell.find();
    return cell;
};
const post = async (request, h) => {
    const cell = await Cell_1.Cell.findOne(request.payload.id);
    if (cell)
        throw boom_1.default.conflict();
    let cellType = await CellType_1.CellType.findOne(request.payload.type);
    if (!cellType) {
        cellType = await CellType_1.CellType.create({
            id: request.payload.type,
            name: request.payload.type,
        }).save();
    }
    const newCell = await Cell_1.Cell.create({
        id: request.payload.id,
        cellType,
        state: Cell_1.Cell.CellState.New,
        class: Cell_1.Cell.CellClass.Normal,
    }).save();
    return h.response(newCell).code(201);
};
exports.default = { get, post };
//# sourceMappingURL=cells.js.map