import * as Hapi from "@hapi/hapi";
import "reflect-metadata";
import { createConnection } from "typeorm";
// import { connect } from "socket.io-client";
import routes from "./routes";

const pjson = require("../package.json");

const init = async () => {
  const server = new Hapi.Server({
    port: 3000,
    host: "0.0.0.0",
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
  console.log("Server running on %s", server.info.uri);

  await createConnection();
};

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

init();
