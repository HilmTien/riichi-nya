import z from "zod";

const player = ["E", "S", "W", "N"] as const;

export const ServerMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("pong"), timestamp: z.number() }),
  z.object({
    type: z.literal("state"),
    currentTurn: z.enum(player),
    discardTime: z.number(),
    callTime: z.number(),
    extraTimers: z.record(z.enum(player), z.number()),
    hasStarted: z.boolean(),
    state: z.enum(["call", "discard"]),
    callCount: z.record(z.enum(player), z.number()),
    nonMenzenchinPlayers: z.array(z.enum(player)),
    riichiPlayers: z.array(z.enum(player)),
  }),
  z.object({
    type: z.literal("settings"),
    turnTime: z.number(),
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
]);

export type ServerMessage = z.infer<typeof ServerMessageSchema>;

export type ClientMessage =
  | {
      type: "ping";
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
      type: "join";
      player: "E" | "S" | "W" | "N";
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
