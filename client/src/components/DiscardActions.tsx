import { useWebSocketContext } from "@/providers/WebSocketProvider";

interface DiscardActionsProps {
  player: "E" | "S" | "W" | "N";
  onClosedKan: () => void;
  chiiOrPonCalled: boolean;
}

export function DiscardActions({
  player,
  onClosedKan,
  chiiOrPonCalled,
}: DiscardActionsProps) {
  const { state, sendMessage } = useWebSocketContext();

  const discardDisabled = state.state !== "discard" || !state.hasStarted;
  const forceDiscard = discardDisabled || chiiOrPonCalled;

  return (
    <div className="flex gap-2">
      <button
        className={`rounded bg-white px-1 py-1 text-blue-500 ${discardDisabled ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={discardDisabled}
        onClick={() => {
          sendMessage({ type: "discard", caller: player });
        }}
      >
        Discard
      </button>
      <button
        className={`rounded bg-white px-1 py-1 text-blue-500 ${forceDiscard ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={forceDiscard}
        onClick={() => {
          sendMessage({ type: "tsumo", caller: player });
        }}
      >
        Tsumo
      </button>
      <button
        className={`rounded bg-white px-1 py-1 text-blue-500 ${forceDiscard ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={forceDiscard}
        onClick={() => {
          sendMessage({ type: "riichi", caller: player });
        }}
      >
        Riichi
      </button>
      <button
        className={`rounded bg-white px-1 py-1 text-blue-500 ${forceDiscard ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={forceDiscard}
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
