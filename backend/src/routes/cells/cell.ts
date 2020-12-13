import { Request, ResponseToolkit } from "@hapi/hapi";

export default function cell(request: Request, h: ResponseToolkit) {
  return { message: `I am cell: ${request.params.id}` };
}
