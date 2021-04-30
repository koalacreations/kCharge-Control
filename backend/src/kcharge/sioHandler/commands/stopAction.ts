import chalk from "chalk";
import { getWS } from "../../../index";
import { Builder } from "../../builder";
import { ISioPayloadStopAction } from "../../types";

export default async function StopAction(message: ISioPayloadStopAction) {
  const builder = new Builder(message.deviceId); // init our packet builder
  const payload = {
    channel: message.channel,
  };

  // attempt to find our web socket client
  const ws = await getWS(message.deviceId);
  if (ws) await ws.send(builder.buildStopAction(payload));
  else console.log(chalk.yellow(`Warning: device ${message.deviceId} not found!`));
}
