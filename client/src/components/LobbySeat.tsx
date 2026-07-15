import { playerToSeat } from "@/lib/utils";
import { useWebSocketContext } from "@/providers/WebSocketProvider";

interface LobbySeatProps {
  seat: "E" | "S" | "W" | "N";
}

export function LobbySeat({ seat }: LobbySeatProps) {
  const { state, sendMessage, clientId } = useWebSocketContext();

  if (!clientId) {
    return;
  }

  return (
    <button
      onClick={() =>
        state.seats[seat] === clientId
          ? sendMessage({ type: "leave", clientId: clientId })
          : sendMessage({ type: "join", clientId: clientId, player: seat })
      }
      disabled={state.seats[seat] !== null && state.seats[seat] !== clientId}
      className={`w-32 rounded bg-amber-300 text-lg text-black ${state.seats[seat] === clientId
          ? "cursor-pointer border border-white bg-blue-200 font-semibold hover:bg-blue-100"
          : state.seats[seat] !== null
            ? "opacity-50"
            : "cursor-pointer hover:bg-amber-200"
        }`}
    >
      {playerToSeat[seat]}
    </button>
  );
}
