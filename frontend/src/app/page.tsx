// "use client";

// import Hero from "@/components/Hero";
// import Info from "@/components/Info";
// import Loading from "@/components/Loading";

// function Page() {
//   return (
//     <div>
//       <Loading />
//       <Info />
//       <Hero />
//     </div>
//   );
// }

// export default Page;

// "use client";
// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";

// // Replace with your server URL
// const SOCKET_SERVER_URL = "http://localhost:3001";

// const Game: React.FC = () => {
//   const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
//   const [grid, setGrid] = useState<string[][]>([]);
//   const [playerColor, setPlayerColor] = useState<string>("");
//   const [players, setPlayers] = useState<any>({});

//   useEffect(() => {
//     const newSocket = io(SOCKET_SERVER_URL, {
//       transports: ["websocket"],
//     });

//     setSocket(newSocket);

//     newSocket.on("init", ({ grid, color }) => {
//       console.log("Received initial grid:", grid);
//       console.log("Received player color:", color);
//       setGrid(grid);
//       setPlayerColor(color);
//     });

//     newSocket.on("updateGrid", ({ grid, players }) => {
//       console.log("Received updated grid:", grid);
//       console.log("Received updated players:", players);
//       setGrid(grid);
//       setPlayers(players);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("Socket disconnected");
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const handleTileClick = (x: number, y: number) => {
//     console.log("Tile clicked at:", x, y);
//     socket?.emit("move", { x, y });
//   };

//   return (
//     <div>
//       <h1>Color Conquest</h1>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: `repeat(${grid.length}, 40px)`,
//         }}
//       >
//         {grid.length > 0 ? (
//           grid.map((row, x) =>
//             row.map((color, y) => (
//               <div
//                 key={`${x}-${y}`}
//                 onClick={() => handleTileClick(x, y)}
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   backgroundColor: color,
//                   border: "1px solid #000",
//                 }}
//               ></div>
//             ))
//           )
//         ) : (
//           <p>Loading grid...</p>
//         )}
//       </div>
//       <div>
//         <h2>Players' Scores</h2>
//         {Object.entries(players).map(([id, player]: any) => (
//           <p key={id} style={{ color: player.color }}>
//             {id}: {player.score}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Game;

"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// Replace with your server URL
const SOCKET_SERVER_URL = "http://localhost:3001";

const Game: React.FC = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [playerColor, setPlayerColor] = useState<string>("");
  const [players, setPlayers] = useState<{
    [key: string]: { name: string; color: string; score: number };
  }>({});
  const [playerName, setPlayerName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");
  const [roomInput, setRoomInput] = useState<string>("");

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("init", ({ grid, color, players }) => {
      console.log("Received initial grid:", grid);
      console.log("Received player color:", color);
      console.log("Received players:", players);
      setGrid(grid);
      setPlayerColor(color);
      setPlayers(players);
    });

    newSocket.on("updateGrid", ({ grid, players }) => {
      console.log("Received updated grid:", grid);
      console.log("Received updated players:", players);
      setGrid(grid);
      setPlayers(players);
    });

    newSocket.on("updatePlayers", (players) => {
      console.log("Received updated players:", players);
      setPlayers(players);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleJoinRoom = () => {
    if (socket) {
      socket.emit("joinRoom", { roomId: roomInput, playerName: nameInput });
      setRoomId(roomInput);
      setNameInput("");
      setRoomInput("");
    }
  };

  const handleTileClick = (x: number, y: number) => {
    if (socket && roomId) {
      socket.emit("move", { roomId, x, y });
    }
  };

  const handleClearData = () => {
    if (socket && roomId) {
      socket.emit("clearData", roomId);
    }
  };

  return (
    <div>
      {!roomId ? (
        <div>
          <h1>Join a Game</h1>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name"
          />
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="Enter room ID"
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <h1>Color Conquest</h1>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 40px)`,
            }}
          >
            {grid.length > 0 ? (
              grid.map((row, x) =>
                row.map((color, y) => (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => handleTileClick(x, y)}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: color,
                      border: "1px solid #000",
                    }}
                  ></div>
                ))
              )
            ) : (
              <p>Loading grid...</p>
            )}
          </div>
          <button onClick={handleClearData}>Clear Data</button>
          <div>
            <h2>Players' Scores</h2>
            {players && Object.keys(players).length > 0 ? (
              Object.entries(players).map(([id, player]) => (
                <p key={id} style={{ color: player.color }}>
                  {player.name}: {player.score}
                </p>
              ))
            ) : (
              <p>No players yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
