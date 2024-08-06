"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Loading() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchData = async () => {
    try {
      const response = await fetch(`https://${SERVER}`);
      if (response.ok) {
        return { name: "Sonner" };
      } else {
        throw new Error("Failed to fetch data from the server");
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const ws = new WebSocket(`wss://${SERVER}`);

    ws.onopen = () => {
      setIsLoading(false);
      setConnectionStatus("Connected to server!");
    };

    ws.onerror = () => {
      setIsLoading(false);
      setConnectionStatus("Failed to connect to server.");
    };

    ws.onclose = () => {
      setConnectionStatus("Connection closed.");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const promise = fetchData().then((data) => {
      if (isMounted) {
        setIsLoading(false);
      }
      return data;
    });

    toast.promise(promise, {
      loading: "Connecting to server",
      success: () => "Server connection successful",
      error: "Server connection failed. Please try again later",
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return <></>;
}
