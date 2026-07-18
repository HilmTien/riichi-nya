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
    <div className="flex justify-center gap-2">
      {!disableKan && (
        <button
          className={
            "from-kan-light to-kan-dark w-36 cursor-pointer rounded bg-linear-to-r px-1 py-1"
          }
          onClick={() => {
            sendMessage({ type: "kan", caller: player });
          }}
        >
          <span className="from-kan-text-top to-kan-text-bottom bg-linear-to-b bg-clip-text text-lg font-semibold text-transparent sm:text-2xl">
            Kan
          </span>
        </button>
      )}
      {!forceDiscard && (
        <button
          className={
            "from-tsumo-light to-tsumo-dark w-36 cursor-pointer rounded bg-linear-to-r px-1 py-1"
          }
          onClick={() => {
            sendMessage({ type: "tsumo", caller: player });
          }}
        >
          <span className="from-tsumo-text-top to-tsumo-text-bottom bg-linear-to-b bg-clip-text text-lg font-semibold text-transparent sm:text-2xl">
            Tsumo
          </span>
        </button>
      )}
      {!disableRiichi && (
        <button
          className={
            "from-riichi-light to-riichi-dark w-36 cursor-pointer rounded bg-linear-to-r px-1 py-1"
          }
          onClick={() => {
            sendMessage({ type: "riichi", caller: player });
          }}
        >
          <span className="from-riichi-text-top to-riichi-text-bottom bg-linear-to-b bg-clip-text text-lg font-semibold text-transparent sm:text-2xl">
            Riichi
          </span>
        </button>
      )}
      {!discardDisabled && (
        <button
          className={
            "from-discard-light to-discard-dark w-36 cursor-pointer rounded bg-linear-to-r px-1 py-1"
          }
          onClick={() => {
            sendMessage({ type: "discard", caller: player });
          }}
        >
          <span className="from-discard-text-top bg-linear-to-b to-white bg-clip-text text-lg font-semibold text-transparent sm:text-2xl">
            Discard
          </span>
        </button>
      )}
    </div>
  );
}
