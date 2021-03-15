import { IPacket } from "./types";
import Parser from "./parser";

export class Builder {
    deviceId: string;

    constructor(deviceId: string) {
      this.deviceId = deviceId;
    }

    // eslint-disable-next-line class-methods-use-this
    buildPacket(commandName: Parser.PacketType, payload: object): string {
      return JSON.stringify({
        version: 1,
        command: commandName,
        deviceId: this.deviceId,
        payload
      });
    }

    buildPing() {
      return this.buildPacket(Parser.PacketType.Ping, {});
    }

    buildPong() {
      return this.buildPacket(Parser.PacketType.Pong, {});
    }
}

export default Builder;
