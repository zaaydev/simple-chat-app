import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

// =======================
// 🚀 SERVER INITIALIZATION
// =======================

// Initialize express server
const expressServer = express();

// i will create a new server with http to use sockets io
// i will wrap express server with new http server
const httpUpgradedServer = createServer(expressServer);

// now i can use socket io on this server
const ioServer = new Server(httpUpgradedServer, {
  cors: {
    origin: process.env.FRONTEND_URL, // 🎯 frontend domain (Vercel)
    credentials: true, // 🍪 allow cookies if needed
  },
});

// =======================
// 🟢 ONLINE USERS STORAGE
// =======================

// special container suitable to store online users quickly
// and delete them quickly (O(1) add/remove)
const onlineUsers = {};

// helper function to get socketId using userId
const getSocketIdWithUserId = (userId) => {
  return onlineUsers[userId];
};

// =======================
// 🔌 SOCKET CONNECTION LOGIC
// =======================

ioServer.on("connection", (socket) => {
  // after connection successful, whenever a client gets online
  // client will send their authId via socket handshake query
  const clientId = socket.handshake.query.clientId;

  // map userId → socketId
  if (clientId) onlineUsers[clientId] = socket.id;

  console.log("🟡 Client CONNECTED");

  // notify all clients about updated online users list
  ioServer.emit("getOnlineUsersFromServer", Object.keys(onlineUsers));

  socket.on("disconnect", () => {
    console.log("🟠 Client DISCONNECTED");

    // remove user from online users map
    delete onlineUsers[clientId];

    // notify all clients again after disconnect
    ioServer.emit("getOnlineUsersFromServer", Object.keys(onlineUsers));
  });
});

export { expressServer, httpUpgradedServer, ioServer, getSocketIdWithUserId };
