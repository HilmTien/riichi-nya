import z from "zod";

const player = ["E", "S", "W", "N"] as const;

export const ClientMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("ping") }),
  z.object({ type: z.literal("state") }),
  z.object({ type: z.literal("start") }),
  z.object({ type: z.literal("reset") }),
  z.object({ type: z.literal("join"), player: z.enum(player) }),
  z.object({ type: z.literal("pon"), caller: z.enum(player) }),
  z.object({ type: z.literal("chii"), caller: z.enum(player) }),
  z.object({ type: z.literal("kan"), caller: z.enum(player) }),
  z.object({ type: z.literal("ron"), caller: z.enum(player) }),
  z.object({ type: z.literal("skip"), caller: z.enum(player) }),
  z.object({ type: z.literal("tsumo"), caller: z.enum(player) }),
  z.object({ type: z.literal("riichi"), caller: z.enum(player) }),
  z.object({ type: z.literal("discard"), caller: z.enum(player) }),
]);

export type ClientMessage = z.infer<typeof ClientMessageSchema>;
