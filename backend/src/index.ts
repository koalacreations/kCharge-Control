import * as Hapi from "@hapi/hapi";
import "reflect-metadata";
import { createConnection } from "typeorm";
import WebSocket from "ws";
import Chalk from "chalk";
import routes from "./routes";

const pjson = require("../package.json");

const WS_PORT = 12345;
const HTTP_PORT = 3000;

const init = async () => {
  const wss = new WebSocket.Server({ port: WS_PORT });

  console.log(Chalk.blue(`Websocket server running on port ${WS_PORT}`));

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      console.log("received: %s", message);
    });
  });

  const server = new Hapi.Server({
    port: HTTP_PORT,
    host: "0.0.0.0",
    routes: {
      cors: true,
    },
    debug: { request: ["error"] },
  });

  server.events.on("response", (request) => {
    // eslint-disable-next-line no-console
    console.log(
      `${request.info.remoteAddress}: ${request.method.toUpperCase()} ${
        request.path
      }`
    );
  });

  server.route(routes);

  server.route({
    method: "GET",
    path: "/",
    handler: () => ({
      message: "You've reached the jCharge API.",
      version: pjson.version,
    }),
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(Chalk.blue(`HTTP server running on ${server.info.uri}`));

  await createConnection();
};

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.error(Chalk.red(err));
  process.exit(1);
});

init();
