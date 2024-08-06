import React from "react";
import { Button } from "@/components/ui/button";
import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
const pixel = Pixelify_Sans({ subsets: ["latin"] });

const Info = () => {
  return (
    <div className="absolute top-5 left-5">
      <Link
        href="/info"
        className={`${pixel.className} text-xl font-black text-primary hover:text-secondary transition-colors duration-300`}
      >
        Info
      </Link>
    </div>
  );
};

export default Info;