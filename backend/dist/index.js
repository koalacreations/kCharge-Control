"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hapi = __importStar(require("@hapi/hapi"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
// import { connect } from "socket.io-client";
const routes_1 = __importDefault(require("./routes"));
const pjson = require("../package.json");
const init = async () => {
    const server = new Hapi.Server({
        port: 3000,
        host: "0.0.0.0",
        debug: { request: ["error"] },
    });
    server.events.on("response", (request) => {
        // eslint-disable-next-line no-console
        console.log(`${request.info.remoteAddress}: ${request.method.toUpperCase()} ${request.path}`);
    });
    server.route(routes_1.default);
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
    await typeorm_1.createConnection();
};
process.on("unhandledRejection", (err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
init();
//# sourceMappingURL=index.js.map