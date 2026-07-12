import React from "react";
import { CallActions } from "./CallActions";
import { DiscardActions } from "./DiscardActions";
import { useWebSocketContext } from "@/providers/WebSocketProvider";
import { GlobalTimer } from "./GlobalTimer";

interface TimerProps {
  player: "E" | "S" | "W" | "N";
  chiiOrPonCalled: boolean;
  setChiiOrPonCalled: (value: boolean) => void;
}

const decrement = (value: number) => (value > 0 ? value - 1 : 0);

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

  const [localDiscardTimer, setLocalDiscardTimer] = React.useState(
    state.discardTimer,
  );
  const [localCallTimer, setLocalCallTimer] = React.useState(state.callTimer);

  React.useEffect(() => {
    if (!state.hasStarted) {
      return;
    }

    let timer;

    if (state.state === "discard") {
      timer = setInterval(() => {
        setLocalDiscardTimer(decrement);
      }, 1000);
    } else {
      timer = setInterval(() => {
        setLocalCallTimer(decrement);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [state.state, state.hasStarted, state.discardTimer, state.callTimer]);

  React.useEffect(() => {
    setLocalDiscardTimer(state.discardTimer);
    setLocalCallTimer(state.callTimer);
  }, [state.discardTimer, state.callTimer]);

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
      setLocalExtraTime(decrement);
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
      {state.state === "discard" && isCurrentTurn ? (
        <div>
          <p>Discard Time: {localDiscardTimer}</p>
          <p>Extra Time: {localExtraTime}</p>
        </div>
      ) : (
        <p className="">Call Time: {localCallTimer}</p>
      )}
      {isCurrentTurn ? (
        <DiscardActions player={player} chiiOrPonCalled={chiiOrPonCalled} />
      ) : (
        <CallActions player={player} setChiiOrPonCalled={setChiiOrPonCalled} />
      )}
    </div>
  );
}
