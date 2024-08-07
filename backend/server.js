const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: ["http://localhost:3000", "https://pixtery.vercel.app"], // Replace with your frontend URLs
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello Pixtery Developer!");
});

// Store room data and player information
const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  // Join a room
  socket.on("joinRoom", ({ roomId, playerName }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        grid: Array(7)
          .fill(null)
          .map(() => Array(7).fill("#ffffff")),
        players: {},
      };
    }

    // Add player to the room
    rooms[roomId].players[socket.id] = {
      name: playerName,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      score: 0,
    };

    // Emit the initial state to the player
    socket.emit("init", {
      grid: rooms[roomId].grid,
      color: rooms[roomId].players[socket.id].color,
      players: rooms[roomId].players,
    });

    // Broadcast the updated player list
    io.to(roomId).emit("updatePlayers", rooms[roomId].players);
  });

  // Handle tile coloring
  socket.on("move", ({ roomId, x, y }) => {
    const room = rooms[roomId];
    const player = room.players[socket.id];
    if (room && room.grid[x][y] === "#ffffff") {
      // Only color if the tile is white
      room.grid[x][y] = player.color;
      player.score++;
      io.to(roomId).emit("updateGrid", {
        grid: room.grid,
        players: room.players,
      });
    }
  });

  // Clear data
  socket.on("clearData", (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].grid = Array(7)
        .fill(null)
        .map(() => Array(7).fill("#ffffff")); // Reset grid
      for (const playerId in rooms[roomId].players) {
        rooms[roomId].players[playerId].score = 0; // Reset scores
      }
      io.to(roomId).emit("updateGrid", {
        grid: rooms[roomId].grid,
        players: rooms[roomId].players,
      });
      io.to(roomId).emit("updatePlayers", rooms[roomId].players); // Notify players of updated scores
    }
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId].players[socket.id]) {
        delete rooms[roomId].players[socket.id];
        io.to(roomId).emit("updatePlayers", rooms[roomId].players);
      }
    }
    console.log("User disconnected: ", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
