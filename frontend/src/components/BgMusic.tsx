"use client";
import React, { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
const BgMusic = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        // @ts-ignore
        audioRef.current.pause();
      } else {
        // @ts-ignore
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-5 right-5">
      <audio
        ref={audioRef}
        src="/bg.mp3"
        autoPlay
        loop
        // @ts-ignore
        volume={0.5}
      />
      <button
        className="text-primary hover:text-secondary transition-colors duration-300"
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <Volume2 className="w-7 h-7" />
        ) : (
          <VolumeX className="w-7 h-7" />
        )}
      </button>
    </div>
  );
};

export default BgMusic;
