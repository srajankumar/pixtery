"use client";
import React, { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

const MusicPlayer: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="fixed top-5 right-5 ">
      <audio ref={audioRef} loop autoPlay>
        <source src="/a-lonely-cherry-tree.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button
        onClick={toggleMute}
        className="text-primary hover:text-secondary transition-colors duration-300"
      >
        {isMuted ? (
          <VolumeX className="w-7 h-7" />
        ) : (
          <Volume2 className="w-7 h-7" />
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
