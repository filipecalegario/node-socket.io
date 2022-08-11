'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const ADMIN = '/admin.html';

const app = express()

const server = app
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

const orderNamespace = io.of("/admin");

orderNamespace.on("connection", (socket) => {
  socket.join("room1");
  orderNamespace.to("room1").emit("hello");
  console.log(`id ${socket.id} entered as order`)
});

const userNamespace = io.of("/users");

userNamespace.on("connection", (socket) => {
  socket.join("room1"); // distinct from the room in the "orders" namespace
  userNamespace.to("room1").emit("holà");
});

io.on('connection',  (socket) => {
  console.log("Clients count " + io.engine.clientsCount);
  console.log('Client connected ' + socket.id);
  socket.on('disconnect', () => console.log('Client disconnected ' + socket.id));
  socket.on('print', () => {
    console.log(`socket ${socket.id} emitted print`);
  })
});

setInterval(() => io.emit('time', { date: new Date().toTimeString(), text: "texto", count: io.engine.clientsCount }), 1000);

