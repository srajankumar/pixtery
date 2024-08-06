"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Back from "@/components/Back";
import { toast } from "sonner";

import { Pixelify_Sans } from "next/font/google";
const pixel = Pixelify_Sans({ subsets: ["latin"] });

const GRID_SIZE = 15;
const CELL_SIZE = 20;

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

function GuesserPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [guess, setGuess] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [timer, setTimer] = useState<number>(0); // Start from 0
  const [gameStatus, setGameStatus] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket(`wss://${SERVER}`);
    setSocket(ws);

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "word") {
            setWord(data.word);
            setTimer(0); // Reset timer when a new word is received
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
            toast.success("Correct guess");
            setGameStatus(`You guessed correctly in ${data.time} seconds!`);
          } else if (data.type === "wrong") {
            toast.error("Wrong guess");
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
        setTimer((prev) => prev + 1); // Increment timer
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
    <div className="max-w-md px-5 gap-5 mx-auto min-h-[100dvh] flex flex-col justify-center items-center">
      <Back />
      <h1 className={`${pixel.className} text-4xl font-black text-primary`}>
        Guess
      </h1>
      <div className="bg-white w-fit border-2 border-secondary rounded-xl">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
        />
      </div>{" "}
      <p>Time elapsed: {timer}s</p>
      <div className="w-full flex flex-col gap-3">
        <Input
          type="text"
          className="bg-white"
          placeholder="Enter your guess"
          value={guess}
          onChange={handleGuessChange}
        />
        <Button className="w-full" onClick={handleGuessSubmit}>
          Submit Guess
        </Button>
      </div>
      {gameStatus && <p>{gameStatus}</p>}
    </div>
  );
}

export default GuesserPage;
