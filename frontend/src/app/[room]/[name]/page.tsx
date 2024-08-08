"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, QrCode, ScanLine } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Pixelify_Sans } from "next/font/google";
import Back from "@/components/Back";
import BgMusic from "@/components/BgMusic";
import Qr from "@/components/Qr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const pixel = Pixelify_Sans({ subsets: ["latin"] });
const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export default function RoomPage({
  params,
}: {
  params: { room: string; name: string };
}) {
  const room_id = params.room;
  const name = decodeURIComponent(params.name);
  //@ts-ignore
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [playerColor, setPlayerColor] = useState<string>("");
  const [players, setPlayers] = useState<{
    [key: string]: { name: string; color: string; score: number };
  }>({});
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

  useEffect(() => {
    if (socket && room_id && name) {
      socket.emit("joinRoom", { roomId: room_id, playerName: name });
    }
  }, [socket, room_id, name]);

  const handleTileClick = (x: number, y: number) => {
    if (socket && room_id) {
      socket.emit("move", { roomId: room_id, x, y });
    }
  };

  const handleClearData = () => {
    if (socket && room_id) {
      socket.emit("clearData", room_id);
    }
  };

  const sortedPlayers = Object.entries(players).sort(
    ([, a], [, b]) => b.score - a.score
  );

  return (
    <section className="flex w-full flex-col min-h-[100dvh] overflow-hidden justify-center items-center md:py-10 py-32">
      <Back />
      <BgMusic />
      <div className="grid md:grid-cols-2 gap-5 lg:gap-20 md:gap-12">
        <div className="md:hidden flex-col flex gap-1">
          <h1 className={`${pixel.className} text-4xl font-black text-primary`}>
            Lobby
          </h1>
          {room_id && (
            <div className="flex justify-center w-fit gap-1 items-center">
              <p className="font-bold text-lg">{room_id}</p>
              <CopyToClipboard text={room_id} onCopy={handleCopy}>
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
          <div className="flex gap-3">
            <Button className="w-full" onClick={handleClearData}>
              Clear Data
            </Button>
            <Dialog>
              <DialogTrigger>
                <div
                  className="w-full inline-flex hover:scale-[102%] transition-all duration-300 items-center justify-center whitespace-nowrap rounded-md text-sm
                  font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 py-2"
                >
                  <ScanLine className="w-5 h-5" />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="w-full text-center">
                    Invite others
                  </DialogTitle>
                </DialogHeader>
                <Qr id={room_id} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="md:flex flex-col hidden gap-1">
            <h1
              className={`${pixel.className} text-4xl font-black text-primary`}
            >
              Lobby
            </h1>
            {room_id && (
              <div className="flex justify-center w-fit gap-1 items-center">
                <p className="font-bold text-lg">{room_id}</p>
                <CopyToClipboard text={room_id} onCopy={handleCopy}>
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
              sortedPlayers.map(([id, player], index) => (
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
    </section>
  );
}
