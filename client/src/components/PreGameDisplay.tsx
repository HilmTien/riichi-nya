import { useWebSocketContext } from "@/providers/WebSocketProvider";
import { LobbySeat } from "./LobbySeat";

export function PreGameDisplay() {
  const { state, sendMessage, clientId } = useWebSocketContext();

  if (!clientId) {
    return <p>Connecting to server</p>;
  }

  const seatsFilled =
    state.seats.E && state.seats.S && state.seats.W && state.seats.N;

  return (
    <div className="relative z-10 flex flex-col items-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">Lobby</h1>
      <div className="flex flex-col items-center gap-4">
        <LobbySeat seat="W" />
        <div className="flex gap-32 sm:gap-40">
          <LobbySeat seat="N" />
          <LobbySeat seat="S" />
        </div>
        <LobbySeat seat="E" />
      </div>
      <div className="flex justify-center gap-10">
        <button
          onClick={() => sendMessage({ type: "start" })}
          className={`w-20 rounded border border-white bg-green-400 text-lg font-semibold text-black sm:text-2xl ${seatsFilled ? "cursor-pointer hover:bg-green-300 active:bg-green-300" : "opacity-50"}`}
        >
          Start
        </button>
        <button
          onClick={() => sendMessage({ type: "reset" })}
          className="w-20 cursor-pointer rounded border border-white bg-red-500 text-lg font-semibold hover:bg-red-400 active:bg-red-400 sm:text-2xl"
        >
          Reset
        </button>
      </div>
      <button
        onClick={() => sendMessage({ type: "rotate_seats" })}
        className="w-48 cursor-pointer rounded border border-white bg-indigo-500 text-lg font-semibold hover:bg-indigo-400 active:bg-indigo-400"
      >
        Rotate Seats
      </button>
    </div>
  );
}
