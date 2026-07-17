import z from "zod";

const player = ["E", "S", "W", "N"] as const;

export const ServerMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("pong") }),
  z.object({
    type: z.literal("state"),
    currentTurn: z.enum(player),
    discardTimer: z.number(),
    callTimer: z.number(),
    extraTimers: z.record(z.enum(player), z.number()),
    extraTimerIsRunning: z.boolean(),
    hasStarted: z.boolean(),
    state: z.enum(["call", "discard"]),
    callCount: z.record(z.enum(player), z.number()),
    nonMenzenchinPlayers: z.array(z.enum(player)),
    riichiPlayers: z.array(z.enum(player)),
  }),
  z.object({
    type: z.literal("settings"),
    discardTime: z.number(),
    callTime: z.number(),
    extraTime: z.number(),
  }),
  z.object({
    type: z.literal("set_player"),
    player: z.enum(player),
  }),
  z.object({
    type: z.literal("set_turn"),
    currentTurn: z.enum(player),
  }),
  z.object({
    type: z.literal("set_extra_timers"),
    extraTimers: z.record(z.enum(player), z.number()),
  }),
  z.object({
    type: z.literal("seats"),
    seats: z.record(z.enum(player), z.uuid().nullable()),
  }),
  z.object({
    type: z.literal("client_id"),
    id: z.uuid(),
  }),
]);

export type ServerMessage = z.infer<typeof ServerMessageSchema>;

export type ClientMessage =
  | {
      type: "ping";
    }
  | {
      type: "request_client_id";
    }
  | {
      type: "state";
    }
  | {
      type: "start";
    }
  | {
      type: "reset";
    }
  | {
      type: "rotate_seats";
    }
  | {
      type: "seats";
    }
  | {
      type: "join";
      clientId: string;
      player: "E" | "S" | "W" | "N";
    }
  | {
      type: "leave";
      clientId: string;
    }
  | {
      type: "pon";
      caller: "E" | "S" | "W" | "N";
    }
  | {
      type: "chii";
      caller: "E" | "S" | "W" | "N";
    }
  | {
      type: "kan";
      caller: "E" | "S" | "W" | "N";
    }
  | {
      type: "ron";
      caller: "E" | "S" | "W" | "N";
    }
  | {
      type: "skip";
      caller: "E" | "S" | "W" | "N";
    }
  | {
      type: "tsumo";
      caller: "E" | "S" | "W" | "N";
    }
  | {
      type: "riichi";
      caller: "E" | "S" | "W" | "N";
    }
  | {
      type: "discard";
      caller: "E" | "S" | "W" | "N";
    };
