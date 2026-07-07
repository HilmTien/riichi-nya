import { nextTurn } from "@/lib/utils";
import { useWebSocketContext } from "@/providers/WebSocketProvider";

interface CallActionsProps {
  player: "E" | "S" | "W" | "N";
  chiiOrPonCalled: boolean;
  setChiiOrPonCalled: (value: boolean) => void;
}

export function CallActions({
  player,
  chiiOrPonCalled,
  setChiiOrPonCalled,
}: CallActionsProps & {
  chiiOrPonCalled: boolean;
  setChiiOrPonCalled: (value: boolean) => void;
}) {
  const { state, sendMessage } = useWebSocketContext();

  const disabled = state.state !== "call" || !state.hasStarted;
  const callDisabled = state.callCount[player] >= 4 || disabled;

  return (
    <div className="flex gap-2">
      <button
        className={`rounded bg-white px-1 py-1 text-blue-500 ${callDisabled ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={callDisabled}
        onClick={() => {
          sendMessage({ type: "pon", caller: player });
          setChiiOrPonCalled(true);
        }}
      >
        Pon
      </button>
      <button
        className={`rounded bg-white px-1 py-1 text-blue-500 ${callDisabled || nextTurn(state.currentTurn) !== player ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={callDisabled || nextTurn(state.currentTurn) !== player}
        onClick={() => {
          sendMessage({ type: "chii", caller: player });
          setChiiOrPonCalled(true);
        }}
      >
        Chii
      </button>
      <button
        className={`rounded bg-white px-1 py-1 text-blue-500 ${callDisabled ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={callDisabled}
        onClick={() => {
          sendMessage({ type: "kan", caller: player });
        }}
      >
        Kan
      </button>
      <button
        className={`rounded bg-white px-1 py-1 text-blue-500 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={disabled}
        onClick={() => {
          sendMessage({ type: "ron", caller: player });
        }}
      >
        Ron
      </button>
      <button
        className={`rounded bg-white px-1 py-1 text-blue-500 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={disabled}
        onClick={() => {
          sendMessage({ type: "skip", caller: player });
        }}
      >
        Skip
      </button>
    </div>
  );
}
