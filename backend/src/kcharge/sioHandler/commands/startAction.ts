import chalk from "chalk";
import { getWS } from "../../../index";
import { Builder } from "../../builder";
import { ISioPayloadStartAction } from "../../types";

export default async function StartAction(message: ISioPayloadStartAction) {
  const builder = new Builder(message.deviceId); // init our packet builder
  const payload = {
    channel: message.channel,
    action: message.action,
    // @ts-ignore
    rate: null,
    // @ts-ignore
    cutoffVoltage: null
  };

  // attempt to find our web socket client
  const ws = await getWS(message.deviceId);
  if (ws) await ws.send(builder.buildStartAction(payload));
  else console.log(chalk.yellow(`Warning: device ${message.deviceId} not found!`));
}
