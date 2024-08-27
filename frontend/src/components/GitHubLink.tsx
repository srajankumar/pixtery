import React from "react";
import { Button } from "@/components/ui/button";
import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
const pixel = Pixelify_Sans({ subsets: ["latin"] });

const GitHubLink = () => {
  return (
    <div className="absolute top-5 right-5">
      <Link
        href="https://github.com/srajankumar/pixtery"
        target="_blank"
        className={`${pixel.className} text-xl font-black text-primary hover:text-secondary transition-colors duration-300`}
      >
        source-code
      </Link>
    </div>
  );
};

export default GitHubLink;
