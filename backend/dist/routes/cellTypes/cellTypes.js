"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const Cell_1 = require("../../models/Cell");
const get = async () => {
    const cell = await Cell_1.Cell.find();
    return cell;
};
const post = async (request) => {
    const cell = await Cell_1.Cell.findOne(request.payload.id);
    if (cell)
        throw boom_1.default.conflict();
    const newCell = Cell_1.Cell.create({
        id: request.payload.id,
        cellType: request.payload.type,
        state: Cell_1.Cell.CellState.New,
    });
    return newCell.save();
};
exports.default = { get, post };
//# sourceMappingURL=cellTypes.js.map