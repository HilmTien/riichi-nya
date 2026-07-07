import React from "react";
import "./index.css";
import { useWebSocketContext } from "./providers/WebSocketProvider";
import { Timer } from "./components/Timer";
import { GlobalTimer } from "./components/GlobalTimer";

export function App() {
  const { state, sendMessage } = useWebSocketContext();
  const [closedKanSignal, setClosedKanSignal] = React.useState(false);
  const [chiiOrPonCalled, setChiiOrPonCalled] = React.useState(false);

  const onClosedKan = () => {
    setClosedKanSignal((prev) => !prev);
  };

  React.useEffect(() => {
    if (state.state === "call") {
      setChiiOrPonCalled(false);
    }
  }, [state.state]);

  return (
    <div className="relative z-10 flex flex-col gap-4 p-8 text-center">
      <p>Latency: {state.latency} ms</p>
      <button onClick={() => sendMessage({ type: "start" })}>Start</button>
      <button onClick={() => sendMessage({ type: "reset" })}>Reset</button>
      <p>State: {state.state}</p>
      <GlobalTimer
        isRunning={state.hasStarted}
        state={state.state}
        callTime={state.callTime}
        discardTime={state.discardTime}
        closedKanSignal={closedKanSignal}
      />
      <Timer
        player="E"
        extraTimers={state.extraTimers}
        isCurrentTurn={state.currentTurn === "E"}
        hasStarted={state.hasStarted}
        discardTime={state.discardTime}
        state={state.state}
        callCount={state.callCount}
        closedKanSignal={closedKanSignal}
        onClosedKan={onClosedKan}
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
      <Timer
        player="S"
        extraTimers={state.extraTimers}
        isCurrentTurn={state.currentTurn === "S"}
        hasStarted={state.hasStarted}
        discardTime={state.discardTime}
        state={state.state}
        callCount={state.callCount}
        closedKanSignal={closedKanSignal}
        onClosedKan={onClosedKan}
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
      <Timer
        player="W"
        extraTimers={state.extraTimers}
        isCurrentTurn={state.currentTurn === "W"}
        hasStarted={state.hasStarted}
        discardTime={state.discardTime}
        state={state.state}
        callCount={state.callCount}
        closedKanSignal={closedKanSignal}
        onClosedKan={onClosedKan}
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
      <Timer
        player="N"
        extraTimers={state.extraTimers}
        isCurrentTurn={state.currentTurn === "N"}
        hasStarted={state.hasStarted}
        discardTime={state.discardTime}
        state={state.state}
        callCount={state.callCount}
        closedKanSignal={closedKanSignal}
        onClosedKan={onClosedKan}
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
    </div>
  );
}

export default App;
