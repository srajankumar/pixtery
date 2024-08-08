"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState } from "react";

import { Pixelify_Sans } from "next/font/google";
const pixel = Pixelify_Sans({ subsets: ["latin"] });

const Page = ({ params }: { params: { room: string } }) => {
  const room_id = params.room;

  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  return (
    <section className="flex w-full min-h-[100dvh] overflow-hidden justify-center items-center">
      <div className="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"></div>
      <div className="fixed left-[50%] top-[50%] z-50 grid w-[90%] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
        <div className="flex gap-3 flex-col space-y-1.5 text-center sm:text-left">
          <div className="flex flex-col gap-3">
            <h1
              className={`${pixel.className} text-4xl font-black text-primary`}
            >
              Pixtery
            </h1>
            <h1 className="text-lg font-semibold leading-none tracking-tight">
              Join Room - <span className="font-bold">{room_id}</span>
            </h1>
          </div>
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
              className="bg-white col-span-4"
            />
            <Link href={`/${room_id}/${name}`} className="col-span-3">
              <Button disabled={!name.trim()} className="w-full">
                Join Room
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
