/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-redeclare */

import Chalk from "chalk";
import WebSocket from "ws";
import {
  IPacket, IPayloadDeviceStatus, IPayloadHelloServer, IPayloadPing, IPayloadPong
} from "../types";
import { Parser } from "../parser";
import { Builder } from "../builder";
import HelloServer from "./commands/HelloServer";
import DeviceStatus from "./commands/DeviceStatus";
import Ping from "./commands/Ping";
import Pong from "./commands/Pong";

export class Handler {
  ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  // eslint-disable-next-line class-methods-use-this
  handle(packet: IPacket): boolean {
    const command = (Parser.PacketType as any)[packet.command];
    const builder = new Builder(packet.deviceId);
    console.log(Chalk(`Got jCharge packet: ${command}`));

    switch (command) {
      case Parser.PacketType.HelloServer:
        HelloServer(packet.payload as IPayloadHelloServer);
        break;

      case Parser.PacketType.Ping:
        Ping(packet.payload as IPayloadPing, this.ws, builder);
        break;

      case Parser.PacketType.Pong:
        Pong(packet.payload as IPayloadPong, this.ws, builder);
        break;

      case Parser.PacketType.DeviceStatus:
        DeviceStatus(packet.payload as IPayloadDeviceStatus, packet.deviceId);
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
