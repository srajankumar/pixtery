"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pixelify_Sans } from "next/font/google";
import Back from "@/components/Back";
const pixel = Pixelify_Sans({ subsets: ["latin"] });

const GRID_SIZE = 15;
const CELL_SIZE = 20;

function DrawerPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [color, setColor] = useState<string>("black");
  const [word, setWord] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "role", role: "drawer" }));
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleCellClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (socket && word) {
      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      const x = e.clientX - (rect?.left || 0);
      const y = e.clientY - (rect?.top || 0);

      const cellX = Math.floor(x / CELL_SIZE) * CELL_SIZE;
      const cellY = Math.floor(y / CELL_SIZE) * CELL_SIZE;

      const context = canvas?.getContext("2d");
      if (context) {
        context.fillStyle = color;
        context.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);

        socket.send(
          JSON.stringify({ type: "draw", x: cellX, y: cellY, color })
        );
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
        socket?.send(JSON.stringify({ type: "clear" }));
      }
    }
  };

  return (
    <div className="max-w-md px-5 gap-5 mx-auto min-h-[100dvh] flex flex-col justify-center items-center">
      <Back />
      <h1 className={`${pixel.className} text-4xl font-black text-primary`}>
        Draw
      </h1>
      <div className="w-full flex flex-col gap-3">
        <Input
          type="text"
          className="bg-white"
          placeholder="Enter word to draw"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <Button
          className="w-full"
          onClick={() => socket?.send(JSON.stringify({ type: "word", word }))}
        >
          Start Drawing
        </Button>
      </div>
      <div className="flex flex-wrap">
        <Button
          className="rounded-none w-10 h-10"
          onClick={() => setColor("#ffffff")}
          style={{ backgroundColor: "#ffffff" }}
        />
        <Button
          className="rounded-none w-10 h-10"
          onClick={() => setColor("black")}
          style={{ backgroundColor: "black" }}
        />
        <Button
          className="rounded-none w-10 h-10"
          onClick={() => setColor("red")}
          style={{ backgroundColor: "red" }}
        />
        <Button
          className="rounded-none w-10 h-10"
          onClick={() => setColor("blue")}
          style={{ backgroundColor: "blue" }}
        />
        <Button
          className="rounded-none w-10 h-10"
          onClick={() => setColor("#108A0F")}
          style={{ backgroundColor: "#108A0F" }}
        />
        <Button
          className="rounded-none w-10 h-10"
          onClick={() => setColor("#5AEA2E")}
          style={{ backgroundColor: "#5AEA2E" }}
        />
        <Button
          className="rounded-none w-10 h-10"
          onClick={() => setColor("#6D3708")}
          style={{ backgroundColor: "#6D3708" }}
        />
        <Button
          className="rounded-none w-10 h-10"
          onClick={() => setColor("#DBBD7E")}
          style={{ backgroundColor: "#DBBD7E" }}
        />
      </div>
      <div className="bg-white w-fit border-2 border-secondary rounded-xl">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          onClick={handleCellClick}
        />
      </div>
      <Button className="w-full" onClick={clearCanvas}>
        Clear Canvas
      </Button>
    </div>
  );
}

export default DrawerPage;
