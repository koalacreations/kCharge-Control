"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const cellTypes_1 = __importDefault(require("./cellTypes"));
const cellType_1 = __importDefault(require("./cellType"));
const cellTypeSchema = joi_1.default.object({
    id: joi_1.default.number().required(),
    type: joi_1.default.string().required(),
    created: joi_1.default.date().timestamp("unix").required(),
});
exports.default = [
    {
        method: "GET",
        path: "/api/cellTypes/",
        handler: cellTypes_1.default.get,
        options: {
            response: {
                schema: joi_1.default.array().items(cellTypeSchema),
            },
        },
    },
    {
        method: "POST",
        path: "/api/cellTypes/",
        handler: cellTypes_1.default.post,
        options: {
            validate: {
                payload: joi_1.default.object({
                    type: joi_1.default.string().min(1).max(10),
                }),
            },
            response: {
                schema: cellTypeSchema,
            },
        },
    },
    { method: "GET", path: "/cellTypes/{id}/", handler: cellType_1.default.get },
];
//# sourceMappingURL=index.js.map