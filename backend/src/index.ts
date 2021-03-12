import * as Hapi from "@hapi/hapi";
import "reflect-metadata";
import { createConnection } from "typeorm";
import WebSocket from "ws";
import Chalk from "chalk";
import dgram from "dgram";
import { Netmask } from "netmask";
import { networkInterfaces } from "os";
import { Server, Socket } from "socket.io";
import Mdns from "mdns";
import routes from "./routes";
import Parser from "./jcharge/parser";
import Handler from "./jcharge/handler";
import { WSResponse } from "../../frontend/src/types";

// Our jCharge packet aprser
const packetParser = new Parser(1);
const pjson = require("../package.json");

// Our port config
const WS_PORT = 12345;
const DISCOVERY_PORT = 54321;
const HTTP_PORT = 3000;
const DeviceConnections = {};
const SocketIOConnections = [] as Array<Socket>;

function calculateAddresses() {
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

  // calculate the broadcast IP for the jCharge hello packet
  // const multicastAddress = "192.168.0.207";
  const multicastAddress = addresses[Object.keys(addresses)[0]][0].broadcast;
  const serverHost = addresses[Object.keys(addresses)[0]][0].address;

  return { broadcast: multicastAddress, server: serverHost };
}

// Setup our jCharge websocket server
const init = async () => {
  const wss = new WebSocket.Server({ port: WS_PORT });
  const broadcaster = dgram.createSocket({ type: "udp4" });
  await broadcaster.bind(DISCOVERY_PORT, "0.0.0.0");
  await broadcaster.setBroadcast(true);
  const addresses = calculateAddresses();

  // Start advertising our ws and http services
  const mdnsHTTP = Mdns.createAdvertisement(Mdns.tcp("jcharge-http"), HTTP_PORT);
  const mdnsSIO = Mdns.createAdvertisement(Mdns.tcp("jcharge-sio"), HTTP_PORT);
  const mdnsWSS = Mdns.createAdvertisement(Mdns.tcp("jcharge-wss"), WS_PORT);
  mdnsHTTP.start();
  mdnsSIO.start();
  mdnsWSS.start();

  // set an interval to broadcast every 5 seconds
  setInterval(() => {
    console.log(Chalk.green(`Broadcasting hello packet to ${addresses.broadcast}`));

    const data = JSON.stringify({
      version: 1,
      command: "hello",
      payload: {
        websocketHost: `${addresses.server}:${WS_PORT}`,
        apiHost: `${addresses.server}:${HTTP_PORT}`,
        time: Math.floor(Date.now() / 1000),
        serverName: "jCharge Server"
      }
    });

    broadcaster.send(data, DISCOVERY_PORT, addresses.broadcast);
  }, 5000);

  // log where the websocket server is running
  // eslint-disable-next-line no-console
  console.log(Chalk.blue(`Websocket server running on port ${WS_PORT}`));

  // whenever we get a new connection, setup a message handler
  wss.on("connection", (ws) => {
    const packetHandler = new Handler(ws);

    ws.on("message", (message) => {
      const parsed = packetParser.parse(JSON.parse(message.toString()));
      packetHandler.handle(parsed);
    });
  });

  // create the hapi HTTP server
  const server = new Hapi.Server({
    port: HTTP_PORT,
    host: "0.0.0.0",
    routes: {
      cors: true,
    },
    debug: { request: ["error"] },
  });

  // create the socket.io server
  const sio = new Server(server.listener, {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    }
  });

  // setup our socket io server new connection handler
  sio.on("connection", (socket: Socket) => {
    const refreshInterval = setInterval(() => {

    }, 1000);

    socket.emit("join", {
      message: "Connected to server.",
      version: pjson.version,
    }, (e: WSResponse) => { console.log(e.message); });

    socket.on("disconnect", () => {
      clearInterval(refreshInterval);
    });
  });

  // add a listener to the "response" event to console log the request method and path for dev
  server.events.on("response", (request) => {
    // eslint-disable-next-line no-console
    console.log(
      `${request.info.remoteAddress}: ${request.method.toUpperCase()} ${
        request.path
      }`
    );
  });

  // setup our main router
  server.route(routes);

  // setup our root route
  server.route({
    method: "GET",
    path: "/",
    handler: () => ({
      message: "You've reached the jCharge API.",
      version: pjson.version,
    }),
  });

  // start the HTTP server
  await server.start();

  // log where the http server is running
  // eslint-disable-next-line no-console
  console.log(Chalk.blue(`HTTP server running on ${server.info.uri}`));

  // creates the db connection
  await createConnection();
};

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.error(Chalk.red(err));
  process.exit(1);
});

// run the init method
init();
