import Joi from "joi";
import channels from "./channels";
import channel from "./channel";

const deviceChannelSchema = Joi.object({
  id: Joi.number().required(),
  channelId: Joi.number(),
  state: Joi.string(),
  stage: Joi.string().allow(null),
  current: Joi.number().required(),
  voltage: Joi.number().required(),
  temperature: Joi.number().allow(null),
  cell: Joi.object(),
  created: Joi.number(),
  device: Joi.number().allow(null)
});

export default [
  {
    method: "GET",
    path: "/api/channels/",
    handler: channels.get,
    options: {
      response: {
        schema: Joi.array().items(deviceChannelSchema),
      },
    },
  },
  { method: "GET", path: "/api/channels/{id}/", handler: channel.get },
  { method: "PUT", path: "/api/channels/{id}/", handler: channel.put },
];
