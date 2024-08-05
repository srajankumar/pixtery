"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 20;
const CELL_SIZE = 30;

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
    <div>
      <h1>Drawer Page</h1>
      <input
        type="text"
        placeholder="Enter word to draw"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />
      <button
        onClick={() => socket?.send(JSON.stringify({ type: "word", word }))}
      >
        Start Drawing
      </button>
      <Button
        onClick={() => setColor("black")}
        style={{ backgroundColor: "black" }}
      />
      <Button
        onClick={() => setColor("red")}
        style={{ backgroundColor: "red" }}
      />
      <Button
        onClick={() => setColor("blue")}
        style={{ backgroundColor: "blue" }}
      />
      <Button
        onClick={() => setColor("green")}
        style={{ backgroundColor: "green" }}
      />
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        onClick={handleCellClick}
        style={{ border: "1px solid black" }}
      />
      <Button onClick={clearCanvas}>Clear Canvas</Button>
    </div>
  );
}

export default DrawerPage;
