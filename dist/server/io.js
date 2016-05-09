"use strict";

var socketIO = require("socket.io");
module.exports = IO;

function IO(http) {
    if (!(this instanceof IO)) return new IO(http);
    var clients = [];
    socketIO = socketIO(http);

    this.on("connection", function (socket) {
        // console.log(`Client ${socket.id} is now connected`);
        // let query = socket.handshake.query;
        // if(!query.name || query.city) {
        //     socket.emit("error", "Please fulfill the required fields.");
        //     return false;
        // }
        clients.push(socket);
        socket.on("disconnect", function () {
            clients = clients.filter(function (storedSocket) {
                return socket.id != storedSocket.id;
            });
        });
    });
};
IO.prototype.on = function (event, callback) {
    // TODO: validate events
    socketIO.on(event, callback);
};
IO.prototype.getClients = function () {
    return clients;
};