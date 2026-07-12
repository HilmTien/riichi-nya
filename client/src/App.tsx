import { InGameDisplay } from "./components/InGameDisplay";
import { PingDisplay } from "./components/PingDisplay";
import { PreGameDisplay } from "./components/PreGameDisplay";
import "./index.css";
import { useWebSocketContext } from "./providers/WebSocketProvider";
import { Timer } from "./components/Timer";
import { SpectateTimer } from "./components/SpectateTimer";

const players = ["E", "S", "W", "N"] as const;

export function App() {
  const { state } = useWebSocketContext();

  return (
    <div className="z-10 flex w-auto flex-col gap-4 text-center">
      <div className="absolute top-4 left-4">
        <PingDisplay />
      </div>
      {state.hasStarted ? <InGameDisplay /> : <PreGameDisplay />}
  React.useEffect(() => {
    if (state.state === "call") {
      setChiiOrPonCalled(false);
    }
  }, [state.state]);

  if (!clientId) {
    return <p>Connecting to server</p>;
  }

  const currentSeat = players.find((plr) => state.seats[plr] === clientId);

  return state.hasStarted ? (
    <div className="relative z-10 flex flex-col gap-4 p-8 text-center">
      <button onClick={() => sendMessage({ type: "reset" })}>Reset</button>
      {currentSeat ? (
        <Timer
          player={currentSeat}
          chiiOrPonCalled={chiiOrPonCalled}
          setChiiOrPonCalled={setChiiOrPonCalled}
        />
      ) : (
        <div className="relative z-10 flex flex-col gap-4 p-8 text-center">
          <SpectateTimer player={"E"} />
          <SpectateTimer player={"S"} />
          <SpectateTimer player={"W"} />
          <SpectateTimer player={"N"} />
        </div>
      )}
      {state.skipVotes !== 0 && <p>Skip votes: {state.skipVotes} / 3</p>}
    </div>
  ) : (
    <div className="relative z-10 flex flex-col gap-4 p-8 text-center">
      <button onClick={() => sendMessage({ type: "start" })}>Start</button>
      <button onClick={() => sendMessage({ type: "reset" })}>Reset</button>
      <button onClick={() => sendMessage({ type: "rotate_seats" })}>
        Rotate Seats
      </button>
      <button
        onClick={() =>
          state.seats.E === clientId
            ? sendMessage({ type: "leave", clientId: clientId })
            : sendMessage({ type: "join", clientId: clientId, player: "E" })
        }
        disabled={state.seats.E !== null && state.seats.E !== clientId}
      >
        East {state.seats.E}
      </button>
      <button
        onClick={() =>
          state.seats.S === clientId
            ? sendMessage({ type: "leave", clientId: clientId })
            : sendMessage({ type: "join", clientId: clientId, player: "S" })
        }
        disabled={state.seats.S !== null && state.seats.S !== clientId}
      >
        South {state.seats.S}
      </button>
      <button
        onClick={() =>
          state.seats.W === clientId
            ? sendMessage({ type: "leave", clientId: clientId })
            : sendMessage({ type: "join", clientId: clientId, player: "W" })
        }
        disabled={state.seats.W !== null && state.seats.W !== clientId}
      >
        West {state.seats.W}
      </button>
      <button
        onClick={() =>
          state.seats.N === clientId
            ? sendMessage({ type: "leave", clientId: clientId })
            : sendMessage({ type: "join", clientId: clientId, player: "N" })
        }
        disabled={state.seats.N !== null && state.seats.N !== clientId}
      >
        North {state.seats.N}
      </button>
    </div>
  );
}

export default App;
