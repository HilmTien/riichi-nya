import type { ServerMessage } from "./types/websocket";

type Player = "E" | "S" | "W" | "N";

interface AppState {
  player: Player;
  currentTurn: Player;
  discardTime: number;
  callTime: number;
  extraTime: number;
  extraTimers: Record<Player, number>;
  latency?: number;
  hasStarted: boolean;
  state: "call" | "discard";
  callCount: Record<Player, number>;
  nonMenzenchinPlayers: Set<Player>;
}

export const initialState: AppState = {
  player: "E",
  currentTurn: "E",
  discardTime: 3,
  callTime: 3,
  extraTime: 10,
  extraTimers: {
    E: 10,
    S: 10,
    W: 10,
    N: 10,
  },
  latency: undefined,
  hasStarted: false,
  state: "discard",
  callCount: {
    E: 0,
    S: 0,
    W: 0,
    N: 0,
  },
  nonMenzenchinPlayers: new Set(),
};

export const reducer = (state: AppState, action: ServerMessage): AppState => {
  switch (action.type) {
    case "pong":
      return { ...state, latency: Date.now() - action.timestamp };
    case "set_player":
      return { ...state, player: action.player };
    case "set_turn":
      return {
        ...state,
        currentTurn: action.currentTurn,
        state: "discard",
      };
    case "set_extra_timers":
      return { ...state, extraTimers: action.extraTimers };
    case "state":
      return {
        ...state,
        currentTurn: action.currentTurn,
        extraTimers: action.extraTimers,
        hasStarted: action.hasStarted,
        state: action.state,
        callCount: action.callCount,
        nonMenzenchinPlayers: new Set(action.nonMenzenchinPlayers),
      };
  }
};
