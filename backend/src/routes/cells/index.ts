import Joi from "joi";
import cells from "./cells";
import cell from "./cell";

const cellSchema = Joi.object({
  id: Joi.number().required(),
  cellType: Joi.object().required(),
  state: Joi.string().required(),
  class: Joi.string().required(),
  created: Joi.date().timestamp("unix").required(),
});

export default [
  {
    method: "GET",
    path: "/api/cells/",
    handler: cells.get,
    options: {
      response: {
        schema: Joi.array().items(cellSchema),
      },
    },
  },
  {
    method: "POST",
    path: "/api/cells/",
    handler: cells.post,
    options: {
      validate: {
        payload: Joi.object({
          id: Joi.number(),
          type: Joi.string().min(1).max(10),
        }),
      },
      response: {
        schema: cellSchema,
      },
    },
  },
  { method: "GET", path: "/api/cells/{id}/", handler: cell.get },
  {
    method: "PUT",
    path: "/api/cells/{id}/",
    handler: cell.put,
    options: {
      response: {
        schema: cellSchema,
      },
    },
  },
];
