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
    const parsedPacket = packet;
    if (packet.version !== this.version) {
      console.log(Chalk.red("Unexpected protocol version number"));
    }

    // if we get a string as the payload try to parse it as JSON
    if (typeof packet.payload === "string") {
      parsedPacket.payload = JSON.parse(packet.payload);
    }

    return parsedPacket;
  }
}

export namespace Parser {
  export enum PacketType {
    Hello = "hello",
    HelloServer = "helloServer",
    Ping = "ping",
    Pong = "pong",
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
