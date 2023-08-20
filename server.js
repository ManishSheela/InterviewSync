// npm run server:dev [to run server]
const express = require("express");
const app = express();
const http = require("http");
// import Server class from socket.io
const { Server } = require("socket.io");
const ACTIONS = require("./src/Action");
const server = http.createServer(app);

const io = new Server(server);
const userSocketMap = {}; // 'EKZiQCauKSFxgViXAAAd':'Manish'

function getAllConnectedClients(roomId) {
  // convert map into array using Array.from
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return { socketId, username: userSocketMap[socketId] };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  // join connection
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    // we get roomId and username from editorPage--> from client
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    // get list of all client connected to this room
    const clients = getAllConnectedClients(roomId);
    console.log("server page", clients);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username: username,
        socketId: socket.id,
      });
    });
  });

// disconnection user
  socket.on('disconnecting', () => {
    const rooms = { ...socket.rooms };
    rooms.forEach((roomId) => {
      
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });

    });
    delete userSocketMap[socket.id]
    socket.leave();
  })
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Listining on port ${PORT}`));
