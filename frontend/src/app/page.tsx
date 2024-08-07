"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

import { Pixelify_Sans } from "next/font/google";
const pixel = Pixelify_Sans({ subsets: ["latin"] });

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

import { CopyToClipboard } from "react-copy-to-clipboard";

import RefreshButton from "@/components/RefreshButton";
import { Check, Copy } from "lucide-react";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export default function Hero() {
  const ref = React.useRef(null);
  const isInView = useInView(ref) as boolean;

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("init", ({ grid, color, players }) => {
      setGrid(grid);
      setPlayerColor(color);
      setPlayers(players);
    });

    newSocket.on("updateGrid", ({ grid, players }) => {
      setGrid(grid);
      setPlayers(players);
    });

    newSocket.on("updatePlayers", (players) => {
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
    const newRoomId = nanoid(6);
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

  const sortedPlayers = Object.entries(players).sort(
    ([, a], [, b]) => b.score - a.score
  );

  return (
    <section className="flex w-full flex-col min-h-[100dvh] overflow-hidden justify-center items-center md:py-10 py-32">
      {roomId && <RefreshButton />}
      {!roomId ? (
        <motion.div
          initial="hidden"
          className="flex justify-center items-center gap-4 flex-col"
          ref={ref}
          animate={isInView ? "show" : "hidden"}
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <div className="flex max-w-md flex-col items-center gap-2 text-center">
            <motion.h1
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className={`${pixel.className} text-5xl font-black text-primary`}
            >
              Pixtery
            </motion.h1>
            <motion.p
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="block text-lg"
            >
              Conquer the territory by coloring pixels.
            </motion.p>
          </div>
          <div className="flex max-w-sm px-5 gap-3 w-full justify-center items-center">
            <motion.div
              className="w-full"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <Dialog>
                <DialogTrigger className="w-full">
                  <div
                    className="w-full inline-flex hover:scale-[102%] transition-all duration-300 items-center justify-center whitespace-nowrap rounded-md text-sm
                  font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Play
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join or Create a Room</DialogTitle>
                    <DialogDescription>
                      Join an existing game with a room code or create a new
                      room to challenge friends or other players in real-time.
                    </DialogDescription>
                    <div className="grid grid-cols-7 gap-3 pt-5">
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
                        className="col-span-3"
                        onClick={handleCreateRoom}
                        disabled={!nameInput}
                      >
                        Create
                      </Button>
                    </div>
                    <div className="grid grid-cols-7 gap-3 pt-5">
                      <Input
                        type="text"
                        value={roomInput}
                        onChange={(e) => setRoomInput(e.target.value)}
                        placeholder="Enter room ID to join"
                        className="bg-white col-span-4"
                      />
                      <Button
                        disabled={!roomInput || !nameInput}
                        className="col-span-3"
                        onClick={handleJoinRoom}
                      >
                        Join Room
                      </Button>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </motion.div>
            <motion.div
              className="w-full"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <Link href="/info" className="w-full">
                <Button className="w-full">About</Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 lg:gap-20 md:gap-12">
          <div className="md:hidden flex-col flex gap-1">
            <h1
              className={`${pixel.className} text-4xl font-black text-primary`}
            >
              Lobby
            </h1>
            {generatedRoomId && (
              <div className="flex justify-center w-fit gap-1 items-center">
                <p className="font-bold text-lg">{generatedRoomId}</p>
                <CopyToClipboard text={generatedRoomId} onCopy={handleCopy}>
                  <button>
                    {copied ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </CopyToClipboard>
              </div>
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
            <div className="md:flex flex-col hidden gap-1">
              <h1
                className={`${pixel.className} text-4xl font-black text-primary`}
              >
                Lobby
              </h1>
              {generatedRoomId && (
                <div className="flex justify-center w-fit gap-1 items-center">
                  <p className="font-bold text-lg">{generatedRoomId}</p>
                  <CopyToClipboard text={generatedRoomId} onCopy={handleCopy}>
                    <button>
                      {copied ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </CopyToClipboard>
                </div>
              )}
            </div>
            <div className="text-lg">
              {players && Object.keys(players).length > 0 ? (
                sortedPlayers.map(([id, player]) => (
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
