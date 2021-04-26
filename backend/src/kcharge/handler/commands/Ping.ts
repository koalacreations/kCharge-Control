import WebSocket from "ws";
import { IPayloadPing } from "../../types";
import Builder from "../../builder";

export default async function Ping(payload: IPayloadPing, ws: WebSocket, builder: Builder) {
  await ws.send(builder.buildPong());
}
