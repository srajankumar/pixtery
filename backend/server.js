const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

let drawerSocket = null;
let guesserSocket = null;
let wordToGuess = "";
let guesserStartTime = null;

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);

    try {
      const data = JSON.parse(message);

      if (data.type === "role") {
        if (data.role === "drawer") {
          drawerSocket = ws;
        } else if (data.role === "guesser") {
          guesserSocket = ws;
          // Send existing word to guesser
          if (wordToGuess) {
            ws.send(JSON.stringify({ type: "word", word: wordToGuess }));
          }
        }
      }

      if (data.type === "word" && drawerSocket === ws) {
        wordToGuess = data.word;
        guesserStartTime = Date.now();
        if (guesserSocket) {
          guesserSocket.send(
            JSON.stringify({ type: "word", word: wordToGuess })
          );
        }
      }

      if (data.type === "draw" && drawerSocket === ws) {
        // Broadcast drawing data to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }

      if (data.type === "clear" && drawerSocket === ws) {
        // Broadcast clear canvas command to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }

      if (data.type === "guess" && guesserSocket === ws) {
        const currentTime = Date.now();
        const timeTaken = Math.floor((currentTime - guesserStartTime) / 1000);

        if (data.guess.toLowerCase() === wordToGuess.toLowerCase()) {
          guesserSocket.send(
            JSON.stringify({ type: "correct", time: timeTaken })
          );
          if (drawerSocket) {
            drawerSocket.send(
              JSON.stringify({ type: "correct", time: timeTaken })
            );
          }
        } else {
          guesserSocket.send(JSON.stringify({ type: "wrong" }));
        }
      }
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (ws === drawerSocket) {
      drawerSocket = null;
    }
    if (ws === guesserSocket) {
      guesserSocket = null;
    }
  });
});
