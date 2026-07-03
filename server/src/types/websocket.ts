import z from "zod";

export const ClientMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("ping"), timestamp: z.number() }),
]);

export type ClientMessage = z.infer<typeof ClientMessageSchema>;