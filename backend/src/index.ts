import express from "express";
import http from "http";
import SocketIOServer from "socket.io";

import initializeSocketIO from "./socket";

const app = express();
const port = 8000 || process.env.PORT;

const server = http.createServer(app);
const io = SocketIOServer(server);

initializeSocketIO(io);

app.get("/", (req, res) => {
  res.send("Hi!");
});


// Start the websocket and http server
server.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});