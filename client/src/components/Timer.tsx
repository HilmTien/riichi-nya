import { useWebSocketContext } from "@/providers/WebSocketProvider";
import React from "react";
import { CallActions } from "./CallActions";
import { DiscardActions } from "./DiscardActions";
import { useWebSocketContext } from "@/providers/WebSocketProvider";
import { playerToSeat } from "@/lib/utils";

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
      className={`w-74 rounded bg-blue-500 p-4 text-sm text-white sm:h-64 sm:w-140 ${isCurrentTurn ? "outline-3" : ""}`}
    >
      <h1 className="pb-5 text-2xl font-semibold">{playerToSeat[player]}</h1>
      <div className="mb-20">
        {state.state === "discard" && isCurrentTurn ? (
          <p className="font-semibold">
            {localDiscardTimer !== 0 && (
              <span className="text-5xl">{localDiscardTimer}</span>
            )}
            <span className="from-extra-time-top to-extra-time-bottom bg-linear-to-b bg-clip-text text-3xl text-transparent">
              {localDiscardTimer !== 0 ? "+" : ""}
              {localExtraTime}
            </span>
          </p>
        ) : state.state === "call" ? (
          <div className="flex flex-col gap-1">
            <p className="text-5xl font-semibold">{localCallTimer}</p>
            {isCurrentTurn && <p>Waiting for other players to call.</p>}
          </div>
        ) : (
          <div className="">
            <h2 className="text-2xl font-semibold">
              Current turn: {playerToSeat[state.currentTurn]}
            </h2>
            <h1 className="text-lg">Please wait.</h1>
          </div>
        )}
      </div>
      {isCurrentTurn ? (
        <DiscardActions player={player} chiiOrPonCalled={chiiOrPonCalled} />
      ) : (
        <CallActions player={player} setChiiOrPonCalled={setChiiOrPonCalled} />
      )}
    </div>
  );
}
