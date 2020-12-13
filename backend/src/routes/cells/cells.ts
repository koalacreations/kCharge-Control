import { ResponseToolkit, RouteEventHandler } from "@hapi/hapi";

export default function cells(request: RouteEventHandler, h: ResponseToolkit) {
  return { message: "I am cells." };
}
