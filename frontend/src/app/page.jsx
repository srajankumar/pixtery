"use client";
import React, { useEffect, useRef, useState } from "react";

function App() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    // Store the WebSocket instance in state
    setSocket(ws);

    ws.onmessage = (event) => {
      // Check if the received data is a Blob
      if (event.data instanceof Blob) {
        const reader = new FileReader();

        reader.onload = () => {
          try {
            const message = JSON.parse(reader.result);
            const { action, currentTime } = message;

            if (audioRef.current) {
              audioRef.current.currentTime = currentTime; // Sync playback time

              if (action === "play-audio") {
                audioRef.current.play();
                setPlaying(true);
              } else if (action === "pause-audio") {
                audioRef.current.pause();
                setPlaying(false);
              }
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        reader.readAsText(event.data);
      } else {
        console.error("Received data is not a Blob:", event.data);
      }
    };

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handlePlay = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      setPlaying(true);
      socket.send(JSON.stringify({ action: "play-audio", currentTime }));
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      setPlaying(false);
      socket.send(JSON.stringify({ action: "pause-audio", currentTime }));
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Audio Stream</h1>
      <audio
        ref={audioRef}
        src="http://localhost:4000/audio"
        controls // Enable native controls
      ></audio>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
      </div>
      <p>Playback Status: {playing ? "Playing" : "Paused"}</p>
    </div>
  );
}

export default App;
