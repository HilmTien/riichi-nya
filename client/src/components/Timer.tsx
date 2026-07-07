import React from "react";
import { CallActions } from "./CallActions";
import { DiscardActions } from "./DiscardActions";
import { useWebSocketContext } from "@/providers/WebSocketProvider";

interface TimerProps {
  player: "E" | "S" | "W" | "N";
  chiiOrPonCalled: boolean;
  setChiiOrPonCalled: (value: boolean) => void;
}

export function Timer({
  player,
  chiiOrPonCalled,
  setChiiOrPonCalled,
}: TimerProps) {
  const { state } = useWebSocketContext();

  const isCurrentTurn = state.currentTurn === player;

  const [localExtraTime, setLocalExtraTime] = React.useState(
    state.extraTimers[player],
  );

  React.useEffect(() => {
    setLocalExtraTime(state.extraTimers[player]);
  }, [state.extraTimers]);

  React.useEffect(() => {
    if (
      !state.extraTimerIsRunning ||
      !isCurrentTurn ||
      !state.hasStarted ||
      state.state === "call"
    ) {
      return;
    }

    const timer = setInterval(() => {
      setLocalExtraTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isCurrentTurn, state.hasStarted, state.state, state.extraTimerIsRunning]);

  return (
    <div
      className={`rounded bg-blue-500 p-4 text-sm text-white ${isCurrentTurn ? "outline-3" : ""}`}
    >
      <p>{player}</p>
      <p>Server timer: {state.extraTimers[player]}</p>
      <p>Local timer: {localExtraTime}</p>
      <p>Call count: {state.callCount[player]}</p>
      {isCurrentTurn ? (
        <DiscardActions player={player} chiiOrPonCalled={chiiOrPonCalled} />
      ) : (
        <CallActions
          player={player}
          chiiOrPonCalled={chiiOrPonCalled}
          setChiiOrPonCalled={setChiiOrPonCalled}
        />
      )}
    </div>
  );
}
