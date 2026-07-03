import type { ServerMessage } from "./types/websocket";

type Player = "E" | "S" | "W" | "N";

interface AppState {
  player: Player;
  currentTurn: Player;
  extraTimers: Record<Player, number>;
  latency?: number;
}

export const initialState: AppState = {
  player: "E",
  currentTurn: "E",
  extraTimers: {
    E: 30,
    S: 30,
    W: 30,
    N: 30,
  },
  latency: undefined,
};

export const reducer = (state: AppState, action: ServerMessage): AppState => {
  switch (action.type) {
    case "set_player":
      return { ...state, player: action.player };
    case "set_turn":
      return { ...state, currentTurn: action.currentTurn };
    case "set_extra_timers":
      return { ...state, extraTimers: action.extraTimers };
    case "pong":
      return { ...state, latency: Date.now() - action.timestamp };
  }
};
