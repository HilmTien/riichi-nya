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
    <div className="flex gap-2">
      {!callDisabled && (
        <button
          className={"rounded bg-white px-1 py-1 text-blue-500"}
          onClick={() => {
            sendMessage({ type: "pon", caller: player });
            setChiiOrPonCalled(true);
          }}
          disabled={hasSkipped}
        >
          Pon
        </button>
      )}
      {!callDisabled && nextTurn(state.currentTurn) === player && (
        <button
          className={"rounded bg-white px-1 py-1 text-blue-500"}
          onClick={() => {
            sendMessage({ type: "chii", caller: player });
            setChiiOrPonCalled(true);
          }}
        >
          Chii
        </button>
      )}
      {!callDisabled && (
        <button
          className={"rounded bg-white px-1 py-1 text-blue-500"}
          onClick={() => {
            sendMessage({ type: "kan", caller: player });
          }}
          disabled={hasSkipped}
        >
          Kan
        </button>
      )}
      {!disabled && (
        <button
          className={"rounded bg-white px-1 py-1 text-blue-500"}
          onClick={() => {
            sendMessage({ type: "ron", caller: player });
          }}
          disabled={hasSkipped}
        >
          Ron
        </button>
      )}
      {!disabled && (
        <button
          className={"rounded bg-white px-1 py-1 text-blue-500"}
          onClick={() => {
            sendMessage({ type: "skip", caller: player });
            setHasSkipped(true);
          }}
          disabled={hasSkipped}
        >
          Skip
        </button>
      )}
    </div>
  );
}
