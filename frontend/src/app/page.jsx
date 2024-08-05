// "use client";
// import React, { useEffect, useRef, useState } from "react";

// function App() {
//   const audioRef = useRef(null);
//   const [playing, setPlaying] = useState(false);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8080");

//     // Store the WebSocket instance in state
//     setSocket(ws);

//     ws.onmessage = (event) => {
//       // Check if the received data is a Blob
//       if (event.data instanceof Blob) {
//         const reader = new FileReader();

//         reader.onload = () => {
//           try {
//             const message = JSON.parse(reader.result);
//             const { action, currentTime } = message;

//             if (audioRef.current) {
//               audioRef.current.currentTime = currentTime; // Sync playback time

//               if (action === "play-audio") {
//                 audioRef.current.play();
//                 setPlaying(true);
//               } else if (action === "pause-audio") {
//                 audioRef.current.pause();
//                 setPlaying(false);
//               }
//             }
//           } catch (error) {
//             console.error("Error parsing WebSocket message:", error);
//           }
//         };

//         reader.readAsText(event.data);
//       } else {
//         console.error("Received data is not a Blob:", event.data);
//       }
//     };

//     ws.onopen = () => {
//       console.log("WebSocket connection established");
//     };

//     ws.onclose = () => {
//       console.log("WebSocket connection closed");
//     };

//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, []);

//   const handlePlay = () => {
//     if (audioRef.current) {
//       const currentTime = audioRef.current.currentTime;
//       setPlaying(true);
//       socket.send(JSON.stringify({ action: "play-audio", currentTime }));
//     }
//   };

//   const handlePause = () => {
//     if (audioRef.current) {
//       const currentTime = audioRef.current.currentTime;
//       setPlaying(false);
//       socket.send(JSON.stringify({ action: "pause-audio", currentTime }));
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h1>Audio Stream</h1>
//       <audio
//         ref={audioRef}
//         src="http://localhost:4000/audio"
//         controls // Enable native controls
//       ></audio>
//       <div style={{ marginTop: "20px" }}>
//         <button onClick={handlePlay}>Play</button>
//         <button onClick={handlePause}>Pause</button>
//       </div>
//       <p>Playback Status: {playing ? "Playing" : "Paused"}</p>
//     </div>
//   );
// }

// export default App;

"use client";
import React, { useEffect, useRef, useState } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 30;

function PaintApp() {
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [color, setColor] = useState("black");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = (event) => {
      console.log("Received data:", event.data);

      if (typeof event.data === "string") {
        // Handle string data
        try {
          const data = JSON.parse(event.data);

          if (canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
              context.fillStyle = data.color;
              context.fillRect(data.x, data.y, CELL_SIZE, CELL_SIZE);
            }
          }
        } catch (error) {
          console.error("Error parsing JSON data:", error);
        }
      } else if (event.data instanceof Blob) {
        // Handle Blob data
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result);

            if (canvasRef.current) {
              const context = canvasRef.current.getContext("2d");
              if (context) {
                context.fillStyle = data.color;
                context.fillRect(data.x, data.y, CELL_SIZE, CELL_SIZE);
              }
            }
          } catch (error) {
            console.error("Error parsing Blob to JSON:", error);
          }
        };
        reader.readAsText(event.data);
      } else {
        console.error(
          "Received data is not in an expected format:",
          event.data
        );
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

  const handleCellClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate cell position
    const cellX = Math.floor(x / CELL_SIZE) * CELL_SIZE;
    const cellY = Math.floor(y / CELL_SIZE) * CELL_SIZE;

    // Fill the cell with the selected color
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.fillStyle = color;
        context.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);

        // Send the coloring action to the server
        if (socket) {
          socket.send(JSON.stringify({ x: cellX, y: cellY, color }));
        }
      }
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        // Optionally, you can send a clear message to the server
        if (socket) {
          socket.send(JSON.stringify({ type: "clear" }));
        }
      }
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  return (
    <div className="bg-white" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Collaborative Coloring Book</h1>
      <div>
        <button
          onClick={() => handleColorChange("black")}
          style={{
            backgroundColor: "black",
            width: "30px",
            height: "30px",
            border: "none",
            margin: "5px",
          }}
        ></button>
        <button
          onClick={() => handleColorChange("red")}
          style={{
            backgroundColor: "red",
            width: "30px",
            height: "30px",
            border: "none",
            margin: "5px",
          }}
        ></button>
        <button
          onClick={() => handleColorChange("blue")}
          style={{
            backgroundColor: "blue",
            width: "30px",
            height: "30px",
            border: "none",
            margin: "5px",
          }}
        ></button>
        <button
          onClick={() => handleColorChange("green")}
          style={{
            backgroundColor: "green",
            width: "30px",
            height: "30px",
            border: "none",
            margin: "5px",
          }}
        ></button>
      </div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        style={{ border: "1px solid black" }}
        onClick={handleCellClick}
      />
      <button
        onClick={clearCanvas}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Clear Canvas
      </button>
    </div>
  );
}

export default PaintApp;
