import { useWebSocket } from "@/hooks/useWebSocket";
import { createContext, useContext } from "react";

const WebSocketContext = createContext<ReturnType<typeof useWebSocket> | null>(
  null,
);

export function WebSocketProvider({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  const value = useWebSocket(url);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  }
  return ctx;
}
