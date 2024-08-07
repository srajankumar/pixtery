// context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
}

const SocketContext = createContext<ISocketContext>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3001"); // replace with your server URL
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
