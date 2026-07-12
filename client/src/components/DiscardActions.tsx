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
      {!discardDisabled && (
        <button
          className={"rounded bg-white px-1 py-1 text-blue-500"}
          onClick={() => {
            sendMessage({ type: "discard", caller: player });
          }}
        >
          Discard
        </button>
      )}
      {!forceDiscard && (
        <button
          className={"rounded bg-white px-1 py-1 text-blue-500"}
          onClick={() => {
            sendMessage({ type: "tsumo", caller: player });
          }}
        >
          Tsumo
        </button>
      )}
      {!disableRiichi && (
        <button
          className={"rounded bg-white px-1 py-1 text-blue-500"}
          onClick={() => {
            sendMessage({ type: "riichi", caller: player });
          }}
        >
          Riichi
        </button>
      )}
      {!disableKan && (
        <button
          className={"rounded bg-white px-1 py-1 text-blue-500"}
          onClick={() => {
            sendMessage({ type: "kan", caller: player });
          }}
        >
          Kan
        </button>
      )}
    </div>
  );
}
