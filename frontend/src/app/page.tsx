"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Pixelify_Sans } from "next/font/google";
const pixel = Pixelify_Sans({ subsets: ["latin"] });

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";
import { nanoid } from "nanoid";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import RefreshButton from "@/components/RefreshButton";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export default function Hero() {
  //@ts-ignore
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [playerColor, setPlayerColor] = useState<string>("");
  const [players, setPlayers] = useState<{
    [key: string]: { name: string; color: string; score: number };
  }>({});
  const [roomId, setRoomId] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");
  const [roomInput, setRoomInput] = useState<string>("");
  const [generatedRoomId, setGeneratedRoomId] = useState<string>("");

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("init", ({ grid, color, players }) => {
      console.log("Received initial grid:", grid);
      console.log("Received player color:", color);
      console.log("Received players:", players);
      setGrid(grid);
      setPlayerColor(color);
      setPlayers(players);
    });

    newSocket.on("updateGrid", ({ grid, players }) => {
      console.log("Received updated grid:", grid);
      console.log("Received updated players:", players);
      setGrid(grid);
      setPlayers(players);
    });

    newSocket.on("updatePlayers", (players) => {
      console.log("Received updated players:", players);
      setPlayers(players);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleJoinRoom = () => {
    if (socket) {
      socket.emit("joinRoom", { roomId: roomInput, playerName: nameInput });
      setRoomId(roomInput);
      setNameInput("");
      setRoomInput("");
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = nanoid(6); // Generate a shorter unique room ID
    setGeneratedRoomId(newRoomId);
    setRoomId(newRoomId);
    if (socket) {
      socket.emit("joinRoom", { roomId: newRoomId, playerName: nameInput });
    }
    setNameInput("");
  };

  const handleTileClick = (x: number, y: number) => {
    if (socket && roomId) {
      socket.emit("move", { roomId, x, y });
    }
  };

  const handleClearData = () => {
    if (socket && roomId) {
      socket.emit("clearData", roomId);
    }
  };

  return (
    <section className="flex w-full flex-col min-h-[100dvh] overflow-hidden justify-center items-center md:py-10 py-32">
      {roomId && <RefreshButton />}
      {!roomId ? (
        <div className="flex justify-center items-center gap-4 flex-col">
          <motion.header
            initial={{
              y: 10,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            className="flex max-w-md flex-col items-center gap-2 text-center"
          >
            <h1
              className={`${pixel.className} text-5xl font-black text-primary`}
            >
              Pixtery
            </h1>
            <div className="block text-lg">
              Conquer the territory by coloring pixels.
            </div>
          </motion.header>
          <motion.div
            initial={{
              y: 10,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            className="max-w-sm w-full px-5"
          >
            <div className="flex gap-3 w-full justify-center items-center">
              <Dialog>
                <DialogTrigger className="w-full">
                  <div className="w-full inline-flex hover:scale-[102%] transition-all duration-300 items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Start
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join or Create a Room</DialogTitle>
                    <DialogDescription>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quisquam architecto consectetur corporis assumenda
                      doloribus.
                    </DialogDescription>
                    <div className="grid grid-cols-6 gap-3 pt-5">
                      <Input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Enter your name"
                        required
                        className="bg-white col-span-4"
                      />
                      <Button
                        type="submit"
                        className="col-span-2"
                        onClick={handleCreateRoom}
                      >
                        Create
                      </Button>
                    </div>
                    <div className="grid grid-cols-6 gap-3 pt-5">
                      <Input
                        type="text"
                        value={roomInput}
                        onChange={(e) => setRoomInput(e.target.value)}
                        placeholder="Enter room ID to join"
                        className="bg-white col-span-4"
                      />
                      <Button className="col-span-2" onClick={handleJoinRoom}>
                        Join Room
                      </Button>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Link href="/info" className="w-full">
                <Button className="w-full">About</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 lg:gap-20 md:gap-12">
          <div className="md:hidden">
            <h1
              className={`${pixel.className} text-4xl font-black text-primary`}
            >
              Lobby
            </h1>
            {generatedRoomId && (
              <p className="font-bold text-xl">{generatedRoomId}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div
              style={{
                gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 40px)`,
              }}
              className="grid border border-secondary"
            >
              {grid.length > 0 ? (
                grid.map((row, x) =>
                  row.map((color, y) => (
                    <div
                      key={`${x}-${y}`}
                      onClick={() => handleTileClick(x, y)}
                      style={{
                        backgroundColor: color,
                      }}
                      className="w-10 h-10 border border-secondary"
                    ></div>
                  ))
                )
              ) : (
                <Skeleton className="w-[17.5rem] h-[17.5rem] rounded-none" />
              )}
            </div>
            {generatedRoomId && (
              <Button className="w-full" onClick={handleClearData}>
                Clear Data
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-5">
            <div className="md:flex flex-col hidden">
              <h1
                className={`${pixel.className} text-4xl font-black text-primary`}
              >
                Lobby
              </h1>
              {generatedRoomId && (
                <p className="font-bold text-xl">{generatedRoomId}</p>
              )}
            </div>
            <div className="text-lg">
              {players && Object.keys(players).length > 0 ? (
                Object.entries(players).map(([id, player]) => (
                  <p
                    className="font-bold"
                    key={id}
                    style={{ color: player.color }}
                  >
                    {player.name}: {player.score} pts
                  </p>
                ))
              ) : (
                <p className="font-bold text-primary">No players yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
