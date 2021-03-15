import WebSocket from "ws";
import { IPayloadPong } from "../../types";
import Builder from "../../builder";

export default async function POng(payload: IPayloadPong, ws: WebSocket, builder: Builder) {
  console.log("Got a PONG!");
}
