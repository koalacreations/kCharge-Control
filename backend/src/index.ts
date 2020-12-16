import * as Hapi from "@hapi/hapi";
import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { connect } from "socket.io-client";
import routes from "./routes";
import { Cell } from "./models/Cell";

const pjson = require("../package.json");

const init = async () => {
  const server = new Hapi.Server({
    port: 3000,
    host: "0.0.0.0",
  });

  server.events.on("response", (request) => {
    console.log(`${request.info.remoteAddress}: ${request.method.toUpperCase()} ${request.path}`);
  });

  server.route(routes);

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => ({
      message: "You've reached the jCharge API.",
      version: pjson.version,
    }),
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);

  const connection = await createConnection();
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
