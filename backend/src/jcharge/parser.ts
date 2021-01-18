/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-redeclare */

import Chalk from "chalk";
import { IPacket } from "./types";

/* eslint-disable import/export */
export class Parser {
  version: number;

  constructor(version: number) {
    this.version = version;
  }

  parse(packet: IPacket): IPacket {
    if (packet.version !== this.version) {
      console.log(Chalk.red("Unexpected protocol version number"));
    }

    const command = (<any>Parser.PacketType)[packet.command];
    if (command === undefined) {
      console.log(Chalk.red(`Invalid command received: '${packet.command}'`));
    }

    return packet;
  }
}

export namespace Parser {
  export enum PacketType {
    Hello = "hello",
    HelloServer = "helloServer",
    DeviceStatus = "deviceStatus",
    ChargeComplete = "chargeComplete",
    DischargeComplete = "dischargeComplete",
    ResistanceComplete = "resistanceComplete",
    StartAction = "startAction",
    StopAction = "stopAction",
    LocateChannel = "locateChannel",
    ReportLocateChannel = "reportLocateChannel",
    ReportMessage = "reportMessage",
    ResetDevice = "resetDevice",
    SetConfiguration = "setConfiguration",
  }
}

export default Parser;
