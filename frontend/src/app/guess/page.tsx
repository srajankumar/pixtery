"use client";

import React, { useRef, useState, useEffect } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 30;

function GuesserPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [guess, setGuess] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const [gameStatus, setGameStatus] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "word") {
            setWord(data.word);
            setTimer(60);
            setGameStatus("");
          }

          if (data.type === "draw") {
            if (canvasRef.current) {
              const context = canvasRef.current.getContext("2d");
              if (context) {
                context.fillStyle = data.color;
                context.fillRect(data.x, data.y, CELL_SIZE, CELL_SIZE);
              }
            }
          }

          if (data.type === "clear") {
            if (canvasRef.current) {
              const context = canvasRef.current.getContext("2d");
              if (context) {
                context.clearRect(
                  0,
                  0,
                  canvasRef.current.width,
                  canvasRef.current.height
                );
              }
            }
          }

          if (data.type === "correct") {
            setGameStatus(`You guessed correctly in ${data.time} seconds!`);
          }
        } catch (error) {
          console.error("Error parsing JSON data:", error);
        }
      }
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "role", role: "guesser" }));
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    if (word) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [word]);

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  const handleGuessSubmit = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: "guess", guess }));
    }
  };

  return (
    <div>
      <h1>Guesser Page</h1>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        style={{ border: "1px solid black" }}
      />
      <input
        type="text"
        placeholder="Enter your guess"
        value={guess}
        onChange={handleGuessChange}
      />
      <button onClick={handleGuessSubmit}>Submit Guess</button>
      {timer > 0 && <p>Time left: {timer}s</p>}
      {gameStatus && <p>{gameStatus}</p>}
    </div>
  );
}

export default GuesserPage;
