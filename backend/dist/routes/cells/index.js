"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const cells_1 = __importDefault(require("./cells"));
const cell_1 = __importDefault(require("./cell"));
const cellSchema = joi_1.default.object({
    id: joi_1.default.number().required(),
    cellType: joi_1.default.object().required(),
    state: joi_1.default.string().required(),
    class: joi_1.default.string().required(),
    created: joi_1.default.date().timestamp("unix").required(),
});
exports.default = [
    {
        method: "GET",
        path: "/api/cells/",
        handler: cells_1.default.get,
        options: {
            response: {
                schema: joi_1.default.array().items(cellSchema),
            },
        },
    },
    {
        method: "POST",
        path: "/api/cells/",
        handler: cells_1.default.post,
        options: {
            validate: {
                payload: joi_1.default.object({
                    id: joi_1.default.number(),
                    type: joi_1.default.string().min(1).max(10),
                }),
            },
            response: {
                schema: cellSchema,
            },
        },
    },
    { method: "GET", path: "/api/cells/{id}/", handler: cell_1.default.get },
    {
        method: "PUT",
        path: "/api/cells/{id}/",
        handler: cell_1.default.put,
        options: {
            response: {
                schema: cellSchema,
            },
        },
    },
];
//# sourceMappingURL=index.js.map