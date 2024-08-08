import React from "react";
import { Button } from "@/components/ui/button";
import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
const pixel = Pixelify_Sans({ subsets: ["latin"] });

const Back = () => {
  return (
    <Link href="/" className="absolute top-5 left-5">
      <Button className="bg-secondary hover:bg-secondary/90">Back</Button>
    </Link>
  );
};

export default Back;
