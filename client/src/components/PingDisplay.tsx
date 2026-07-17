import { useWebSocketContext } from "@/providers/WebSocketProvider";

export function PingDisplay() {
  const { ping } = useWebSocketContext();

  return (
    <div className="rounded bg-blue-500 p-2 text-sm text-white">
      <p>Ping: {ping} ms</p>
    </div>
  );
}
