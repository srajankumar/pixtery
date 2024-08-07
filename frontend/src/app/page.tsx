"use client";

import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { Pixelify_Sans } from "next/font/google";
const pixel = Pixelify_Sans({ subsets: ["latin"] });
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { nanoid } from "nanoid";
import { Check, Copy } from "lucide-react";

export default function Hero() {
  const ref = React.useRef(null);
  const isInView = useInView(ref) as boolean;

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  const [nameInput, setNameInput] = useState<string>("");
  const [roomInput, setRoomInput] = useState<string>("");
  const [generatedRoomId, setGeneratedRoomId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinRoom = () => {
    if (nameInput && roomInput) {
      window.location.href = `/${roomInput}/${nameInput}`;
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = nanoid(6);
    setGeneratedRoomId(newRoomId);
    if (nameInput) {
      window.location.href = `/${newRoomId}/${nameInput}`;
    }
  };

  return (
    <section className="flex w-full flex-col min-h-[100dvh] overflow-hidden justify-center items-center md:py-10 py-32">
      {!generatedRoomId ? (
        <motion.div
          initial="hidden"
          className="flex w-full justify-center items-center gap-4 flex-col"
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
                <button onClick={handleCopy}>
                  {copied ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
