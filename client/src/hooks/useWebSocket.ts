import { initialState, reducer } from "@/AppState";
import { parseServerMessage } from "@/lib/utils";
import type { ClientMessage } from "@/types/websocket";
import { useCallback, useEffect, useReducer, useRef } from "react";

export const useWebSocket = (url: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.addEventListener("message", (event: MessageEvent<string>) => {
      const message = parseServerMessage(event.data);
      console.log(message);
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

  return { state, sendMessage };
};
