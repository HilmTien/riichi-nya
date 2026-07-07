import { useWebSocketContext } from "@/providers/WebSocketProvider";

interface DiscardActionsProps {
  player: "E" | "S" | "W" | "N";
  chiiOrPonCalled: boolean;
}

export function DiscardActions({
  player,
  chiiOrPonCalled,
}: DiscardActionsProps) {
  const { state, sendMessage } = useWebSocketContext();

  const discardDisabled = state.state !== "discard" || !state.hasStarted;
  const forceDiscard = discardDisabled || chiiOrPonCalled;
  const disableRiichi =
    forceDiscard ||
    state.nonMenzenchinPlayers.has(player) ||
    state.riichiPlayers.has(player);
  const disableKan = forceDiscard || state.callCount[player] >= 4;

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
        className={`rounded bg-white px-1 py-1 text-blue-500 ${disableRiichi ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={disableRiichi}
        onClick={() => {
          sendMessage({ type: "riichi", caller: player });
        }}
      >
        Riichi
      </button>
      <button
        className={`rounded bg-white px-1 py-1 text-blue-500 ${disableKan ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={disableKan}
        onClick={() => {
          sendMessage({ type: "kan", caller: player });
        }}
      >
        Kan
      </button>
    </div>
  );
}
