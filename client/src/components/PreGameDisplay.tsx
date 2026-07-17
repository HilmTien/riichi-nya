import { useWebSocketContext } from "@/providers/WebSocketProvider";

export function PreGameDisplay() {
  const { state, sendMessage, clientId } = useWebSocketContext();

  if (!clientId) {
    return <p>Connecting to server</p>;
  }

  return (
    <>
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
    </>
  );
}
