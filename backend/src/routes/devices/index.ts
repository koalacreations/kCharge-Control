import Joi from "joi";
import devices from "./devices";
import device from "./device";

const deviceSchema = Joi.object({
  id: Joi.string().required(),
  deviceName: Joi.string().allow(null, ""),
  deviceManufacturer: Joi.string().required(),
  deviceModel: Joi.string().required(),
  channels: Joi.number().required(),
  charge: Joi.boolean().required(),
  discharge: Joi.boolean().required(),
  configurableChargeCurrent: Joi.boolean().required(),
  configurableDischargeCurrent: Joi.boolean().required(),
  configurableChargeVoltage: Joi.boolean().required(),
  configurableDischargeVoltage: Joi.boolean().required(),
  created: Joi.date().timestamp("unix").required(),
});

export default [
  {
    method: "GET",
    path: "/api/devices/",
    handler: devices.get,
    options: {
      response: {
        schema: Joi.array().items(deviceSchema),
      },
    },
  },
  { method: "GET", path: "/api/devices/{id}/", handler: device.get },
];
