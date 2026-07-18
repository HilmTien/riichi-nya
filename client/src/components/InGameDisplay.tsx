import { useWebSocketContext } from "@/providers/WebSocketProvider";
import React from "react";
import { SpectateTimer } from "./SpectateTimer";
import { Timer } from "./Timer";

const players = ["E", "S", "W", "N"] as const;

export function InGameDisplay() {
  const { state, sendMessage, clientId } = useWebSocketContext();

  const [chiiOrPonCalled, setChiiOrPonCalled] = React.useState(false);

  React.useEffect(() => {
    if (state.state === "call") {
      setChiiOrPonCalled(false);
    }
  }, [state.state]);

  const currentSeat = players.find((plr) => state.seats[plr] === clientId);

  return (
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
  );
}
