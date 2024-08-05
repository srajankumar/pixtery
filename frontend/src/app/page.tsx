"use client";
import React, { useEffect, useRef, useState } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 30;

function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [color, setColor] = useState<string>("black");
  const [role, setRole] = useState<"drawer" | "guesser" | null>(null);
  const [word, setWord] = useState<string>("");
  const [guess, setGuess] = useState<string>("");
  const [timer, setTimer] = useState<number>(60); // 60 seconds for the guessing
  const [gameStatus, setGameStatus] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = (event) => {
      console.log("Received data:", event.data);

      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "word" && role === "guesser") {
            setWord(data.word);
            setGameStatus("");
            setTimer(60);
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
      console.log("WebSocket connection established");
      if (role) {
        ws.send(JSON.stringify({ type: "role", role }));
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [role]);

  useEffect(() => {
    if (role === "guesser" && word) {
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
  }, [role, word]);

  const handleCellClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (role === "drawer") {
      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      const x = e.clientX - (rect?.left || 0);
      const y = e.clientY - (rect?.top || 0);

      const cellX = Math.floor(x / CELL_SIZE) * CELL_SIZE;
      const cellY = Math.floor(y / CELL_SIZE) * CELL_SIZE;

      if (canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        if (context) {
          context.fillStyle = color;
          context.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);

          if (socket) {
            socket.send(
              JSON.stringify({ type: "draw", x: cellX, y: cellY, color })
            );
          }
        }
      }
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        if (socket) {
          socket.send(JSON.stringify({ type: "clear" }));
        }
      }
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const handleStartDrawing = () => {
    if (socket && role === "drawer" && word) {
      socket.send(JSON.stringify({ type: "word", word }));
    }
  };

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  const handleGuessSubmit = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: "guess", guess }));
    }
  };

  const handleRoleSelect = (selectedRole: "drawer" | "guesser") => {
    setRole(selectedRole);
  };

  return (
    <div
      className="bg-white text-black"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h1>Collaborative Drawing and Guessing Game</h1>

      {role === null ? (
        <>
          <button onClick={() => handleRoleSelect("drawer")}>
            I want to be the Drawer
          </button>
          <button onClick={() => handleRoleSelect("guesser")}>
            I want to be the Guesser
          </button>
        </>
      ) : (
        <>
          {role === "drawer" && (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Enter word to draw"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                />
                <button onClick={handleStartDrawing}>Start Drawing</button>
              </div>
              <div>
                <button
                  onClick={() => handleColorChange("black")}
                  style={{
                    backgroundColor: "black",
                    width: "30px",
                    height: "30px",
                    border: "none",
                    margin: "5px",
                  }}
                ></button>
                <button
                  onClick={() => handleColorChange("red")}
                  style={{
                    backgroundColor: "red",
                    width: "30px",
                    height: "30px",
                    border: "none",
                    margin: "5px",
                  }}
                ></button>
                <button
                  onClick={() => handleColorChange("blue")}
                  style={{
                    backgroundColor: "blue",
                    width: "30px",
                    height: "30px",
                    border: "none",
                    margin: "5px",
                  }}
                ></button>
                <button
                  onClick={() => handleColorChange("green")}
                  style={{
                    backgroundColor: "green",
                    width: "30px",
                    height: "30px",
                    border: "none",
                    margin: "5px",
                  }}
                ></button>
              </div>
              <canvas
                ref={canvasRef}
                width={GRID_SIZE * CELL_SIZE}
                height={GRID_SIZE * CELL_SIZE}
                style={{ border: "1px solid black" }}
                onClick={handleCellClick}
              />
              <button
                onClick={clearCanvas}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  fontSize: "16px",
                }}
              >
                Clear Canvas
              </button>
            </>
          )}

          {role === "guesser" && (
            <>
              <canvas
                ref={canvasRef}
                width={GRID_SIZE * CELL_SIZE}
                height={GRID_SIZE * CELL_SIZE}
                className=""
                style={{ border: "1px solid black" }}
                onClick={handleCellClick}
              />
              <input
                type="text"
                placeholder="Enter your guess"
                value={guess}
                onChange={handleGuessChange}
              />
              <button onClick={handleGuessSubmit}>Submit Guess</button>
              {timer > 0 && <p>Time left: {timer}s</p>}
            </>
          )}

          {gameStatus && <p>{gameStatus}</p>}
        </>
      )}
    </div>
  );
}

export default PaintApp;
