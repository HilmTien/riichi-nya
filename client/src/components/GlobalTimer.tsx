import { useWebSocketContext } from "@/providers/WebSocketProvider";
import React from "react";

interface GlobalTimerProps {
  closedKanSignal: boolean;
}

const decrement = (value: number) => (value > 0 ? value - 1 : 0);

export function GlobalTimer({ closedKanSignal }: GlobalTimerProps) {
  const { state } = useWebSocketContext();

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
  }, [state.state, state.hasStarted]);

  React.useEffect(() => {
    setLocalDiscardTimer(state.discardTimer);
    setLocalCallTimer(state.callTimer);
  }, [state.discardTimer, state.callTimer]);

  // React.useEffect(() => {
  //   setLocalDiscardTimer(state.discardTimer);
  // }, [state.discardTimer]);

  // React.useEffect(() => {
  //   setLocalCallTimer(state.callTimer);
  // }, [state.callTimer]);

  return (
    <div>
      <p>Global Timer: {localDiscardTimer}</p>
      <p>Call Timer: {localCallTimer}</p>
    </div>
  );
}
