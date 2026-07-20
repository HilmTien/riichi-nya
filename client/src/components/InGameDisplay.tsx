import { useWebSocketContext } from "@/providers/WebSocketProvider";
import React from "react";
import { SpectateTimer } from "./SpectateTimer";
import { Timer } from "./Timer";

const players = ["E", "S", "W", "N"] as const;

export function InGameDisplay() {
  const { state, clientId } = useWebSocketContext();

  const [chiiOrPonCalled, setChiiOrPonCalled] = React.useState(false);

  React.useEffect(() => {
    if (state.state === "call") {
      setChiiOrPonCalled(false);
    }
  }, [state.state]);

  const currentSeat = players.find((plr) => state.seats[plr] === clientId);

  return (
    <div className="relative z-10 flex flex-col items-center gap-4 p-8">
      {currentSeat ? (
        <Timer
          player={currentSeat}
          chiiOrPonCalled={chiiOrPonCalled}
          setChiiOrPonCalled={setChiiOrPonCalled}
        />
      ) : (
        <div className="relative z-10 flex flex-col gap-4 p-8 text-center">
          <h1 className="text-2xl font-semibold">Spectator</h1>
          <div className="flex flex-col items-center gap-10">
            <SpectateTimer player="W" />
            <div className="flex flex-col gap-10 sm:flex-row sm:gap-40">
              <SpectateTimer player="N" />
              <SpectateTimer player="S" />
            </div>
            <SpectateTimer player="E" />
          </div>
        </div>
      )}
    </div>
  );
}
