import Joi from "joi";
import devices from "./devices";
import device from "./device";

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
    path: "/api/devices/",
    handler: devices.get,
    options: {
      response: {
        schema: Joi.array().items(cellSchema),
      },
    },
  },
  { method: "GET", path: "/api/devices/{id}/", handler: device.get },
];
