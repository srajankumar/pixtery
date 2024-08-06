"use client";
import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const MusicPlayer: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const savedState = localStorage.getItem("isMuted");
    return savedState === "true";
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem("isMuted", newMuteState.toString());
    if (audioRef.current) {
      audioRef.current.muted = newMuteState;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current
        .play()
        .catch((error) => console.error("Failed to play audio:", error));
    }
  }, [isMuted]);

  return (
    <div className="fixed top-5 right-5">
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
