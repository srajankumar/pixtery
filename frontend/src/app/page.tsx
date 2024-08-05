"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

function Page() {
  return (
    <div
      className="bg-white text-black"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h1>Welcome to the Collaborative Drawing and Guessing Game</h1>
      <div className="flex gap-3 w-full justify-center items-center">
        <Link href="/draw">
          <Button>Draw</Button>
        </Link>
        <Link href="/guess">
          <Button>Guess</Button>
        </Link>
      </div>
    </div>
  );
}

export default Page;
