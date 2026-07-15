import { InGameDisplay } from "./components/InGameDisplay";
import { PingDisplay } from "./components/PingDisplay";
import { PreGameDisplay } from "./components/PreGameDisplay";
import "./index.css";
import { useWebSocketContext } from "./providers/WebSocketProvider";
import { Timer } from "./components/Timer";
import { SpectateTimer } from "./components/SpectateTimer";
import { LobbySeat } from "./components/LobbySeat";

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
  const seatsFilled =
    state.seats.E && state.seats.S && state.seats.W && state.seats.N;

  return state.hasStarted ? (
    <div className="relative z-10 flex flex-col gap-4 p-8 text-center">
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
      <button
        onClick={() => sendMessage({ type: "reset" })}
        className="w-20 cursor-pointer rounded border border-white bg-red-500 font-semibold hover:bg-red-400"
      >
        Reset
      </button>
    </div>
  ) : (
    <div className="relative z-10 flex flex-col items-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">Lobby</h1>
      <div className="grid grid-cols-2 gap-2">
        <LobbySeat seat="E" />
        <LobbySeat seat="S" />
        <LobbySeat seat="W" />
        <LobbySeat seat="N" />
      </div>
      <div className="flex justify-center gap-10">
        <button
          onClick={() => sendMessage({ type: "start" })}
          className={`w-20 rounded border border-white bg-green-400 font-semibold text-black ${seatsFilled ? "cursor-pointer hover:bg-green-300" : "opacity-50"}`}
        >
          Start
        </button>
        <button
          onClick={() => sendMessage({ type: "reset" })}
          className="w-20 cursor-pointer rounded border border-white bg-red-500 font-semibold hover:bg-red-400"
        >
          Reset
        </button>
      </div>
      <button
        onClick={() => sendMessage({ type: "rotate_seats" })}
        className="w-32 cursor-pointer rounded border border-white bg-indigo-500 font-semibold hover:bg-indigo-400"
      >
        Rotate Seats
      </button>
    </div>
  );
}

export default App;
