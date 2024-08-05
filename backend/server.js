// const express = require("express");
// const WebSocket = require("ws");
// const path = require("path");

// const app = express();
// const PORT = 4000;
// const wss = new WebSocket.Server({ port: 8080 });

// // Serve static files
// app.use(express.static("public"));

// // Serve the audio file
// app.get("/audio", (req, res) => {
//   const audioFilePath = path.join(__dirname, "public", "audio.mp3");
//   res.sendFile(audioFilePath);
// });

// // WebSocket logic
// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   ws.on("message", (message) => {
//     // Broadcast the message to all clients as a string
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message); // Ensure message is a string
//       }
//     });
//   });

//   ws.on("close", () => console.log("Client disconnected"));
// });

// app.listen(PORT, () => {
//   console.log(`HTTP server running at http://localhost:${PORT}`);
//   console.log("WebSocket server running on ws://localhost:8080");
// });

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);

    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
