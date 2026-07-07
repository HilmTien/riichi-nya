import React from "react";
import { CallActions } from "./CallActions";
import { DiscardActions } from "./DiscardActions";

interface TimerProps {
  player: "E" | "S" | "W" | "N";
  extraTimers: Record<"E" | "S" | "W" | "N", number>;
  isCurrentTurn: boolean;
  hasStarted: boolean;
  discardTime: number;
  state: "call" | "discard";
  callCount: Record<"E" | "S" | "W" | "N", number>;
  closedKanSignal: boolean;
  onClosedKan: () => void;
  chiiOrPonCalled: boolean;
  setChiiOrPonCalled: (value: boolean) => void;
}

export function Timer({
  player,
  extraTimers,
  isCurrentTurn,
  hasStarted,
  discardTime,
  state,
  callCount,
  closedKanSignal,
  onClosedKan,
  chiiOrPonCalled,
  setChiiOrPonCalled,
}: TimerProps) {
  const [localExtraTime, setLocalExtraTime] = React.useState(
    extraTimers[player],
  );

  React.useEffect(() => {
    setLocalExtraTime(extraTimers[player]);
  }, [extraTimers]);

  React.useEffect(() => {
    if (!isCurrentTurn || !hasStarted || state === "call") {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      setLocalExtraTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      timeoutId = setTimeout(tick, 1000);
    };

    timeoutId = setTimeout(tick, discardTime * 1000 + 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [closedKanSignal, isCurrentTurn, hasStarted, discardTime, state]);

  return (
    <div
      className={`rounded bg-blue-500 p-4 text-sm text-white ${isCurrentTurn ? "outline-3" : ""}`}
    >
      <p>{player}</p>
      <p>Server timer: {extraTimers[player]}</p>
      <p>Local timer: {localExtraTime}</p>
      <p>Call count: {callCount[player]}</p>
      {isCurrentTurn ? (
        <DiscardActions
          player={player}
          onClosedKan={onClosedKan}
          chiiOrPonCalled={chiiOrPonCalled}
        />
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
