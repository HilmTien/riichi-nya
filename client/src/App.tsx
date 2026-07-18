import { InGameDisplay } from "./components/InGameDisplay";
import { PingDisplay } from "./components/PingDisplay";
import { PreGameDisplay } from "./components/PreGameDisplay";
import "./index.css";
import { useWebSocketContext } from "./providers/WebSocketProvider";

export function App() {
  const { state, sendMessage } = useWebSocketContext();

  return (
    <div className="z-10 flex w-auto flex-col gap-4 text-center">
      <div className="absolute top-4 left-4">
        <PingDisplay />
      </div>
      {state.hasStarted && (
        <button
          onClick={() => sendMessage({ type: "reset" })}
          className="absolute top-4 right-4 w-20 cursor-pointer rounded border border-white bg-red-500 font-semibold hover:bg-red-400 active:bg-red-400"
        >
          Reset
        </button>
      )}
      {state.hasStarted ? <InGameDisplay /> : <PreGameDisplay />}
    </div>
  );
}

export default App;
