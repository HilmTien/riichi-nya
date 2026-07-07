import React from "react";

interface GlobalTimerProps {
  isRunning: boolean;
  state: "call" | "discard";
  callTime: number;
  discardTime: number;
  closedKanSignal: boolean;
}

export function GlobalTimer({
  isRunning,
  state,
  callTime,
  discardTime,
  closedKanSignal,
}: GlobalTimerProps & { callTime: number; discardTime: number }) {
  const [timer, setTimer] = React.useState(
    state === "call" ? callTime : discardTime,
  );

  React.useEffect(() => {
    setTimer(state === "call" ? callTime : discardTime);
  }, [closedKanSignal, isRunning, state, callTime, discardTime]);

  React.useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, state]);

  return (
    <div>
      <p>Global Timer: {timer}</p>
    </div>
  );
}
