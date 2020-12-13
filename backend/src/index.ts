import * as Hapi from "@hapi/hapi";
import "reflect-metadata";
import { createConnection } from "typeorm";
import routes from "./routes";
import { Cell } from "./entity/Cell";

const pjson = require("../package.json");

const init = async () => {
  const server = new Hapi.Server({
    port: 3000,
    host: "0.0.0.0",
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

  // console.log("Inserting a new cell into the database...");
  const cell2 = await Cell.count({
    where:
        { id: 1 },
  });

  const users = await Cell.find();
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
