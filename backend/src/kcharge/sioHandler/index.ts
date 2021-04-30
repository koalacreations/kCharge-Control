/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-redeclare */

import Chalk from "chalk";
import startAction from "./commands/startAction";
import stopAction from "./commands/stopAction";
import { WSCommand } from "../../../../frontend/src/types";
import { ISioPayloadStartAction, ISioPayloadStopAction } from "../types";

export class Handler {
  // eslint-disable-next-line class-methods-use-this
  handle(message: WSCommand): boolean {
    switch (message.command) {
      case "startAction":
        startAction(message.data as ISioPayloadStartAction);
        break;

      case "stopAction":
        stopAction(message.data as ISioPayloadStopAction);
        break;

      default:
        console.log(Chalk.red(`No handler for SIO message: '${message.command}'`));
    }
    return true;
  }
}

export default Handler;
