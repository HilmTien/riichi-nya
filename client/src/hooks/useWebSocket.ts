import { initialState, reducer } from "@/AppState";
import { parseServerMessage } from "@/lib/utils";
import type { ClientMessage } from "@/types/websocket";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

export const useWebSocket = (url: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const socketRef = useRef<WebSocket | null>(null);
  const [clientId, setClientId] = useState<string | null>(
    localStorage.getItem("clientId"),
  );

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      const existingId = localStorage.getItem("clientId");

      if (existingId) {
        setClientId(existingId);
      } else {
        socket.send(JSON.stringify({ type: "request_client_id" }));
      }
    });

    socket.addEventListener("message", (event: MessageEvent<string>) => {
      const message = parseServerMessage(event.data);
      if (message?.type !== "pong") {
        console.log(message);
      }
      if (message?.type === "client_id") {
        localStorage.setItem("clientId", message.id);
        setClientId(message.id);
      }
      if (message) {
        dispatch(message);
      }
    });

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: ClientMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      sendMessage({ type: "state" });
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [sendMessage]);

  useEffect(() => {
    const timer = setInterval(() => {
      sendMessage({ type: "ping" });
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [sendMessage]);

  return { state, sendMessage, clientId };
};
