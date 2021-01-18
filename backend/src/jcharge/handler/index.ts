/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-redeclare */

import Chalk from "chalk";
import WebSocket from "ws";
import { IPacket, IPayloadHelloServer } from "../types";
import { Parser } from "../parser";
import HelloServer from "./commands/HelloServer";

export class Handler {
  ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  // eslint-disable-next-line class-methods-use-this
  handle(packet: IPacket): boolean {
    const command = (<any>Parser.PacketType)[packet.command];

    switch (command) {
      case Parser.PacketType.HelloServer:
        HelloServer(packet.payload as IPayloadHelloServer);
        break;

      case Parser.PacketType.DeviceStatus:
        console.log(
          Chalk.yellow(`'${packet.command}' is not implemented on this server.`)
        );
        break;

      case Parser.PacketType.ChargeComplete:
        console.log(
          Chalk.yellow(`'${packet.command}' is not implemented on this server.`)
        );
        break;

      case Parser.PacketType.DischargeComplete:
        console.log(
          Chalk.yellow(`'${packet.command}' is not implemented on this server.`)
        );
        break;

      case Parser.PacketType.ResistanceComplete:
        console.log(
          Chalk.yellow(`'${packet.command}' is not implemented on this server.`)
        );
        break;

      default:
        console.log(Chalk.red(`No handler for packet: '${packet.command}'`));
    }
    return true;
  }
}

export default Handler;
