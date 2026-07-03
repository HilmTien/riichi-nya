import z from "zod";

export const ServerMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("set_player"), player: z.enum(["E", "S", "W", "N"]) }),
  z.object({ type: z.literal("set_turn"), currentTurn: z.enum(["E", "S", "W", "N"]) }),
  z.object({ type: z.literal("set_extra_timers"), extraTimers: z.record(z.enum(["E", "S", "W", "N"]), z.number()) }),
  z.object({ type: z.literal("pong"), timestamp: z.number() }),
]);

export type ServerMessage = z.infer<typeof ServerMessageSchema>;

export type ClientMessage =
  | { type: "ping"; timestamp: number }
  | { type: "set_player"; player: "E" | "S" | "W" | "N" }
  | { type: "set_turn"; currentTurn: "E" | "S" | "W" | "N" }
  | { type: "set_extra_timers"; extraTimers: Record<"E" | "S" | "W" | "N", number> };