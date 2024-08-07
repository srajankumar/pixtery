import React from "react";
import { Button } from "@/components/ui/button";
import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
const pixel = Pixelify_Sans({ subsets: ["latin"] });

const RefreshButton = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button
      className={`${pixel.className} absolute top-5 left-5 text-xl font-black text-primary hover:text-secondary transition-colors duration-300`}
      onClick={handleRefresh}
    >
      Back
    </button>
  );
};

export default RefreshButton;
