import React from "react";
import "./index.css";
import { useWebSocketContext } from "./providers/WebSocketProvider";
import { Timer } from "./components/Timer";
import { GlobalTimer } from "./components/GlobalTimer";

export function App() {
  const { state, sendMessage, clientId } = useWebSocketContext();
  const [chiiOrPonCalled, setChiiOrPonCalled] = React.useState(false);

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
      <GlobalTimer />
      <Timer
        player="E"
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
      <Timer
        player="S"
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
      <Timer
        player="W"
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
      <Timer
        player="N"
        chiiOrPonCalled={chiiOrPonCalled}
        setChiiOrPonCalled={setChiiOrPonCalled}
      />
    </div>
  );
}

export default App;
