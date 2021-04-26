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
import Parser from "./kcharge/parser";
import Handler from "./kcharge/handler";
import { WSResponse } from "../../frontend/src/types";
import { Device } from "./models/Device";
import { DeviceChannel } from "./models/DeviceChannel";

// Our kCharge packet parser
const packetParser = new Parser(1);
// tslint:disable-next-line:no-var-requires
const pjson = require("../package.json");

// Our port config
const WS_PORT = 12345;
const DISCOVERY_PORT = 54321;
const HTTP_PORT = 3000;
const SocketIOConnections = [] as Socket[];
let wss: WebSocket.Server;

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

  // calculate the broadcast IP for the kCharge hello packet
  // const multicastAddress = "192.168.0.207";
  const multicastAddress = addresses[Object.keys(addresses)[0]][0].broadcast;
  const serverHost = addresses[Object.keys(addresses)[0]][0].address;

  return { broadcast: multicastAddress, server: serverHost };
}

// Setup our kCharge websocket server
const init = async () => {
  wss = new WebSocket.Server({ port: WS_PORT });
  const broadcaster = dgram.createSocket({ type: "udp4" });
  await broadcaster.bind(DISCOVERY_PORT, "0.0.0.0");
  await broadcaster.setBroadcast(true);
  const addresses = calculateAddresses();

  // Start advertising our ws and http services
  const mdnsHTTP = Mdns.createAdvertisement(Mdns.tcp("kCharge-http"), HTTP_PORT);
  const mdnsSIO = Mdns.createAdvertisement(Mdns.tcp("kCharge-sio"), HTTP_PORT);
  const mdnsWSS = Mdns.createAdvertisement(Mdns.tcp("kCharge-wss"), WS_PORT);
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
        serverName: "kCharge Server"
      }
    });

    broadcaster.send(data, DISCOVERY_PORT, addresses.broadcast);
  }, 5000);

  // log where the websocket server is running
  // eslint-disable-next-line no-console
  console.log(Chalk.blue(`Websocket server running on port ${WS_PORT}`));

  // creates the db connection
  await createConnection();

  // find our device and update it's state
  // @ts-ignore
  const devices = await Device.find();

  devices.map(async (device) => {
    device.connected = false;
    device.save();

    const channels = await DeviceChannel.find({ where: { device: device.id } });

    // reset all the channels back to default values
    channels.map((channel) => {
      channel.state = DeviceChannel.DeviceChannelState.empty;
      channel.current = 0;
      channel.voltage = 0;
      channel.temperature = 0;
      channel.capacity = 0;
      channel.save();
    });
  });
  try {
  // whenever we get a new connection, setup a message handler and heartbeats
    wss.on("connection", (ws) => {
      // this stops unhandled websocket exceptions from crashing the entire server
      ws.on("error", console.error);

      // @ts-ignore
      ws.isAlive = true;

      // Setup a regular heartbeat interval
      // @ts-ignore
      ws.heartbeartInterval = setInterval(async () => {
      // @ts-ignore
        if (ws.isAlive === false) {
        // if we didn't get a pong since the last time we ran, assume we got disconnected
          console.log("DISCONNECTED :(");
          // @ts-ignore
          clearInterval(ws.heartbeartInterval);

          // find our device and update it's state
          // @ts-ignore
          const device = await Device.findOne(ws.deviceId);

          if (device) {
            device.connected = false;
            device.save();

            const channels = await DeviceChannel.find({ where: { device: device.id } });

            // reset all the channels back to default values
            channels.map((channel) => {
              channel.state = DeviceChannel.DeviceChannelState.empty;
              channel.current = 0;
              channel.voltage = 0;
              channel.temperature = 0;
              channel.capacity = 0;
              channel.save();
            });
          }

          // terminate (what's left of) the websocket connection
          return ws.terminate();
        }

        // @ts-ignore
        ws.isAlive = false;
        ws.ping();

        return true;
      }, 7000);

      console.log("============ DEVICE CONNECTED ============");
      const packetHandler = new Handler(ws);

      ws.on("message", (message: { toString: () => string; }) => {
        const parsed = packetParser.parse(JSON.parse(message.toString()));
        console.log(`Got WS Message: ${parsed.command}`);
        packetHandler.handle(parsed, ws);
      });

      ws.on("pong", () => {
      // @ts-ignore
        ws.isAlive = true;
      });
    });
  } catch (e) {
    console.log("ERRRRRROR");
    console.log(e);
  }
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
    // console.log(
    //   `${request.info.remoteAddress}: ${request.method.toUpperCase()} ${
    //     request.path
    //   }`
    // );
  });

  // setup our main router
  server.route(routes);

  // setup our root route
  server.route({
    method: "GET",
    path: "/",
    handler: () => ({
      message: "You've reached the kCharge API.",
      version: pjson.version,
    }),
  });

  // start the HTTP server
  await server.start();

  // log where the http server is running
  // eslint-disable-next-line no-console
  console.log(Chalk.blue(`HTTP server running on ${server.info.uri}`));
};

process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.error(Chalk.red(err));
  process.exit(1);
});

// run the init method
init();
