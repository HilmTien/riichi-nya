import type { ServerMessage } from "./types/websocket";

type Player = "E" | "S" | "W" | "N";

interface AppState {
  player: Player;
  currentTurn: Player;
  discardTime: number;
  callTime: number;
  extraTime: number;
  extraTimers: Record<Player, number>;
  extraTimerIsRunning: boolean;
  discardTimer: number;
  callTimer: number;
  latency?: number;
  hasStarted: boolean;
  state: "call" | "discard";
  callCount: Record<Player, number>;
  nonMenzenchinPlayers: Set<Player>;
  riichiPlayers: Set<Player>;
}

export const initialState: AppState = {
  player: "E",
  currentTurn: "E",
  discardTime: 10,
  callTime: 10,
  extraTime: 30,
  discardTimer: 10,
  callTimer: 10,
  extraTimers: {
    E: 60,
    S: 60,
    W: 60,
    N: 60,
  },
  extraTimerIsRunning: false,
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
  riichiPlayers: new Set(),
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
        discardTimer: action.discardTimer,
        callTimer: action.callTimer,
        hasStarted: action.hasStarted,
        extraTimerIsRunning: action.extraTimerIsRunning,
        state: action.state,
        callCount: action.callCount,
        nonMenzenchinPlayers: new Set(action.nonMenzenchinPlayers),
        riichiPlayers: new Set(action.riichiPlayers),
      };
    case "settings":
      return {
        ...state,
        discardTime: action.discardTime,
        callTime: action.callTime,
        extraTime: action.extraTime,
      };
  }
};
