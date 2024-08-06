"use client";
import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const MusicPlayer: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        audioRef.current.muted = isMuted;
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Failed to play audio:", error);
        }
      }
    };

    playAudio();
  }, [isMuted]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    if (audioRef.current) {
      audioRef.current.muted = newMuteState;
      // Optionally play audio if unmuted
      if (!newMuteState) {
        audioRef.current
          .play()
          .catch((error) => console.error("Failed to play audio:", error));
      }
    }
  };

  return (
    <div className="fixed top-5 right-5">
      <audio ref={audioRef} loop>
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
