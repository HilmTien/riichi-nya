import { useWebSocketContext } from "@/providers/WebSocketProvider";

interface CallActionsProps {
  player: "E" | "S" | "W" | "N";
}

export function CallActions({ player }: CallActionsProps) {
  const { sendMessage } = useWebSocketContext();

  return (
    <div>
      <button
        onClick={() => {
          sendMessage({ type: "pon", caller: player });
        }}
      >
        Pon
      </button>
      <button
        onClick={() => {
          sendMessage({ type: "chii", caller: player });
        }}
      >
        Chii
      </button>
      <button
        onClick={() => {
          sendMessage({ type: "kan", caller: player });
        }}
      >
        Kan
      </button>
      <button
        onClick={() => {
          sendMessage({ type: "ron", caller: player });
        }}
      >
        Ron
      </button>
      <button
        onClick={() => {
          sendMessage({ type: "skip", caller: player });
        }}
      >
        Skip
      </button>
    </div>
  );
}
