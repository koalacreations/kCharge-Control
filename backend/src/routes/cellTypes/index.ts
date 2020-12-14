import Joi from "joi";
import cellTypes from "./cellTypes";
import cellType from "./cellType";

const cellTypeSchema = Joi.object({
  id: Joi.number().required(),
  type: Joi.string().required(),
  created: Joi.date().timestamp("unix").required(),
});

export default [
  {
    method: "GET",
    path: "/api/cellTypes/",
    handler: cellTypes.get,
    options: {
      response: {
        schema: Joi.array().items(cellTypeSchema),
      },
    },
  },
  {
    method: "POST",
    path: "/api/cellTypes/",
    handler: cellTypes.post,
    options: {
      validate: {
        payload: Joi.object({
          type: Joi.string().min(1).max(10),
        }),
      },
      response: {
        schema: cellTypeSchema,
      },
    },
  },
  { method: "GET", path: "/cellTypes/{id}/", handler: cellType.get },
];
