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
  closedKanSignal: boolean;
  onClosedKan: () => void;
}

export function Timer({
  player,
  extraTimers,
  isCurrentTurn,
  hasStarted,
  discardTime,
  state,
  closedKanSignal,
  onClosedKan,
}: TimerProps) {
  const [localExtraTime, setLocalExtraTime] = React.useState(
    extraTimers[player]
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
      className={`rounded p-4 ${isCurrentTurn ? "bg-blue-500 text-white" : "bg-gray-200"}`}
    >
      <p>{player}</p>
      <p>{extraTimers[player]}</p>
      <p>{localExtraTime}</p>
      {isCurrentTurn ? (
        <DiscardActions player={player} onClosedKan={onClosedKan} />
      ) : (
        <CallActions player={player} />
      )}
    </div>
  );
}
