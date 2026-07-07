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
      <GlobalTimer closedKanSignal={closedKanSignal} />
      <Timer
        player="E"
        closedKanSignal={closedKanSignal}
        onClosedKan={onClosedKan}
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
      <Timer
        player="S"
        closedKanSignal={closedKanSignal}
        onClosedKan={onClosedKan}
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
      <Timer
        player="W"
        closedKanSignal={closedKanSignal}
        onClosedKan={onClosedKan}
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
      <Timer
        player="N"
        closedKanSignal={closedKanSignal}
        onClosedKan={onClosedKan}
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
    </div>
  );
}

export default App;
