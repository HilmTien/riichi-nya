import { InGameDisplay } from "./components/InGameDisplay";
import { PingDisplay } from "./components/PingDisplay";
import { PreGameDisplay } from "./components/PreGameDisplay";
import "./index.css";
import { useWebSocketContext } from "./providers/WebSocketProvider";

export function App() {
  const { state } = useWebSocketContext();

  return (
    <div className="z-10 flex w-auto flex-col gap-4 text-center">
      <div className="absolute top-4 left-4">
        <PingDisplay />
      </div>
      {state.hasStarted ? <InGameDisplay /> : <PreGameDisplay />}
    </div>
  );
}

export default App;
