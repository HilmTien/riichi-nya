import { nextTurn } from "@/lib/utils";
import { useWebSocketContext } from "@/providers/WebSocketProvider";
import React from "react";

interface CallActionsProps {
  player: "E" | "S" | "W" | "N";
  setChiiOrPonCalled: (value: boolean) => void;
}

export function CallActions({ player, setChiiOrPonCalled }: CallActionsProps) {
  const { state, sendMessage } = useWebSocketContext();
  const [hasSkipped, setHasSkipped] = React.useState(false);

  const disabled = state.state !== "call" || !state.hasStarted;
  const callDisabled =
    state.callCount[player] >= 4 || state.riichiPlayers.has(player) || disabled;

  React.useEffect(() => {
    setHasSkipped(false);
  }, [state.currentTurn]);

  return (
    <div className="mt-10 flex justify-center gap-2">
      {!callDisabled && (
        <button
          className={`from-pon-light to-pon-dark w-36 rounded bg-linear-to-r px-1 py-1 ${hasSkipped ? "opacity-50" : "cursor-pointer"}`}
          onClick={() => {
            sendMessage({ type: "pon", caller: player });
            setChiiOrPonCalled(true);
          }}
          disabled={hasSkipped}
        >
          <span className="from-pon-text-top bg-linear-to-b to-white bg-clip-text text-2xl font-semibold text-transparent">
            Pon
          </span>
        </button>
      )}
      {!callDisabled && nextTurn(state.currentTurn) === player && (
        <button
          className={`from-chii-light to-chii-dark w-36 rounded bg-linear-to-r px-1 py-1 ${hasSkipped ? "opacity-50" : "cursor-pointer"}`}
          onClick={() => {
            sendMessage({ type: "chii", caller: player });
            setChiiOrPonCalled(true);
          }}
        >
          <span className="from-chii-text-top to-chii-text-bottom bg-linear-to-b bg-clip-text text-2xl font-semibold text-transparent">
            Chii
          </span>
        </button>
      )}
      {!callDisabled && (
        <button
          className={`from-kan-light to-kan-dark w-36 rounded bg-linear-to-r px-1 py-1 ${hasSkipped ? "opacity-50" : "cursor-pointer"}`}
          onClick={() => {
            sendMessage({ type: "kan", caller: player });
          }}
          disabled={hasSkipped}
        >
          <span className="from-kan-text-top to-kan-text-bottom bg-linear-to-b bg-clip-text text-2xl font-semibold text-transparent">
            Kan
          </span>
        </button>
      )}
      {!disabled && (
        <button
          className={`from-ron-light to-ron-dark w-36 rounded bg-linear-to-r px-1 py-1 ${hasSkipped ? "opacity-50" : "cursor-pointer"}`}
          onClick={() => {
            sendMessage({ type: "ron", caller: player });
          }}
          disabled={hasSkipped}
        >
          <span className="from-ron-text-top to-ron-text-bottom bg-linear-to-b bg-clip-text text-2xl font-semibold text-transparent">
            Ron
          </span>
        </button>
      )}
      {!disabled && (
        <button
          className={`from-discard-light to-discard-dark w-36 rounded bg-linear-to-r px-1 py-1 ${hasSkipped ? "opacity-50" : "cursor-pointer"}`}
          onClick={() => {
            sendMessage({ type: "skip", caller: player });
            setHasSkipped(true);
          }}
          disabled={hasSkipped}
        >
          <span className="from-discard-text-top bg-linear-to-b to-white bg-clip-text text-2xl font-semibold text-transparent">
            Skip
          </span>
        </button>
      )}
    </div>
  );
}
