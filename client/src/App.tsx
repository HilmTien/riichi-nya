import "./index.css";
import { useWebSocketContext } from "./providers/WebSocketProvider";

export function App() {
  const { state, sendMessage } = useWebSocketContext();

  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <button
        onClick={() => sendMessage({ type: "ping", timestamp: Date.now() })}
      >
        Test
      </button>
      <p>{state.latency}</p>
    </div>
  );
}

export default App;
