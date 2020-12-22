"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const messageExpirationTimeMS = 10 * 1000;
const sendMessage = (socket) => (message) => socket.emit("message", message);
exports.default = (io) => {
    const messages = new Set();
    io.on("connection", (socket) => {
        socket.on("getMessages", () => {
            messages.forEach(sendMessage(socket));
        });
        socket.on("message", (value) => {
            const message = {
                id: uuid_1.v4(),
                time: new Date(),
                value,
            };
            messages.add(message);
            sendMessage(io)(message);
            setTimeout(() => {
                messages.delete(message);
                io.emit("deleteMessage", message.id);
            }, messageExpirationTimeMS);
        });
    });
};
//# sourceMappingURL=socket.js.map