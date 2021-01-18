import * as Hapi from "@hapi/hapi";
import "reflect-metadata";
import { createConnection } from "typeorm";
import WebSocket from "ws";
import Chalk from "chalk";
import dgram from "dgram";
import { Netmask } from "netmask";
import { networkInterfaces } from "os";
import routes from "./routes";
import Parser from "./jcharge/parser";
import Handler from "./jcharge/handler";
import { IDeviceConnection } from "./models/Device";

const packetParser = new Parser(1);
const pjson = require("../package.json");

const WS_PORT = 12345;
const DISCOVERY_PORT = 54321;
const HTTP_PORT = 3000;
const DeviceConnections = [] as Array<IDeviceConnection>;

const init = async () => {
  const wss = new WebSocket.Server({ port: WS_PORT });
  const broadcaster = dgram.createSocket({ type: "udp4" });
  await broadcaster.bind(DISCOVERY_PORT, "0.0.0.0");

  const interfaces = networkInterfaces();
  const addresses = {} as any;

  // eslint-disable-next-line no-restricted-syntax
  for (const name of Object.keys(interfaces)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const net of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        if (!addresses[name]) {
          addresses[name] = [];
        }
        addresses[name].push({ address: net.address, broadcast: new Netmask(net.cidr).broadcast });
      }
    }
  }

  console.log(addresses);
  const multicastAddress = "192.168.0.207";
  // const multicastAddress = addresses[Object.keys(addresses)[0]][0].broadcast;
  const serverHost = addresses[Object.keys(addresses)[0]][0].address;

  setInterval(() => {
    console.log(Chalk.green(`Broadcasting hello packet to ${multicastAddress}`));

    const data = JSON.stringify({
      version: 1,
      command: "hello",
      payload: {
        serverHost: `${serverHost}:${WS_PORT}`,
        time: Math.floor(Date.now() / 1000),
        serverName: "jCharge Server"
      }
    });

    broadcaster.send(data, DISCOVERY_PORT, multicastAddress);
  }, 3000);

  console.log(Chalk.blue(`Websocket server running on port ${WS_PORT}`));

  wss.on("connection", (ws) => {
    const packetHandler = new Handler(ws);

    ws.on("message", (message) => {
      const parsed = packetParser.parse(JSON.parse(message.toString()));
      packetHandler.handle(parsed);
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
