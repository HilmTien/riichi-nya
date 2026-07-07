import { useWebSocketContext } from "@/providers/WebSocketProvider";

interface DiscardActionsProps {
  player: "E" | "S" | "W" | "N";
  onClosedKan: () => void;
}

export function DiscardActions({ player, onClosedKan }: DiscardActionsProps) {
  const { sendMessage } = useWebSocketContext();

  return (
    <div>
      <button
        onClick={() => {
          sendMessage({ type: "discard", caller: player });
        }}
      >
        Discard
      </button>
      <button
        onClick={() => {
          sendMessage({ type: "tsumo", caller: player });
        }}
      >
        Tsumo
      </button>
      <button
        onClick={() => {
          sendMessage({ type: "riichi", caller: player });
        }}
      >
        Riichi
      </button>
      <button
        onClick={() => {
          sendMessage({ type: "kan", caller: player });
          onClosedKan();
        }}
      >
        Kan
      </button>
    </div>
  );
}
