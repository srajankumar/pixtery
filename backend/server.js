// const http = require("http");
// const WebSocket = require("ws");
// const PORT = process.env.PORT || 8080;

// const allowedOrigins = ["http://localhost:3000", "https://pixtery.vercel.app"];

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }

//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//   if (req.method === "OPTIONS") {
//     res.writeHead(204);
//     res.end();
//     return;
//   }

//   res.writeHead(200);
//   res.end("WebSocket server");
// });

// // Attach WebSocket server to the HTTP server
// const wss = new WebSocket.Server({ server });

// let drawerSocket = null;
// let guesserSocket = null;
// let wordToGuess = "";
// let guesserStartTime = null;

// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   ws.on("message", (message) => {
//     console.log("Received:", message);

//     try {
//       const data = JSON.parse(message);

//       if (data.type === "role") {
//         if (data.role === "drawer") {
//           drawerSocket = ws;
//         } else if (data.role === "guesser") {
//           guesserSocket = ws;
//           // Send existing word to guesser
//           if (wordToGuess) {
//             ws.send(JSON.stringify({ type: "word", word: wordToGuess }));
//           }
//         }
//       }

//       if (data.type === "word" && drawerSocket === ws) {
//         wordToGuess = data.word;
//         guesserStartTime = Date.now();
//         if (guesserSocket) {
//           guesserSocket.send(
//             JSON.stringify({ type: "word", word: wordToGuess })
//           );
//         }
//       }

//       if (data.type === "draw" && drawerSocket === ws) {
//         // Broadcast drawing data to all clients
//         wss.clients.forEach((client) => {
//           if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(data));
//           }
//         });
//       }

//       if (data.type === "clear" && drawerSocket === ws) {
//         // Broadcast clear canvas command to all clients
//         wss.clients.forEach((client) => {
//           if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(data));
//           }
//         });
//       }

//       if (data.type === "guess" && guesserSocket === ws) {
//         const currentTime = Date.now();
//         const timeTaken = Math.floor((currentTime - guesserStartTime) / 1000);

//         if (data.guess.toLowerCase() === wordToGuess.toLowerCase()) {
//           guesserSocket.send(
//             JSON.stringify({ type: "correct", time: timeTaken })
//           );
//           if (drawerSocket) {
//             drawerSocket.send(
//               JSON.stringify({ type: "correct", time: timeTaken })
//             );
//           }
//         } else {
//           guesserSocket.send(JSON.stringify({ type: "wrong" }));
//         }
//       }
//     } catch (error) {
//       console.error("Error parsing JSON data:", error);
//     }
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");
//     if (ws === drawerSocket) {
//       drawerSocket = null;
//     }
//     if (ws === guesserSocket) {
//       guesserSocket = null;
//     }
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Replace with your frontend URL
//     methods: ["GET", "POST"],
//   },
// });

// const gridSize = 10; // 10x10 grid
// let grid = Array(gridSize)
//   .fill()
//   .map(() => Array(gridSize).fill("neutral"));
// let players = {};

// io.on("connection", (socket) => {
//   console.log("A user connected: ", socket.id);

//   // Assign player a unique color
//   const playerColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//   players[socket.id] = { color: playerColor, score: 0 };

//   // Log to check if init is being sent
//   console.log("Sending initial grid and player color");
//   socket.emit("init", { grid, color: playerColor });

//   socket.on("move", ({ x, y }) => {
//     if (grid[x][y] !== players[socket.id].color) {
//       grid[x][y] = players[socket.id].color;
//       players[socket.id].score++;
//       io.emit("updateGrid", { grid, players });
//     }
//   });

//   socket.on("disconnect", () => {
//     delete players[socket.id];
//     console.log("User disconnected: ", socket.id);
//   });
// });

// server.listen(3001, () => {
//   console.log("Server is running on port 3001");
// });

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3001;

// Store room data and player information
const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  // Join a room
  socket.on("joinRoom", ({ roomId, playerName }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        grid: Array(10)
          .fill(null)
          .map(() => Array(10).fill("#ffffff")), // 10x10 grid
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
      rooms[roomId].grid = Array(10)
        .fill(null)
        .map(() => Array(10).fill("#ffffff")); // Reset grid
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
