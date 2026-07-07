import { ServerMessageSchema, type ServerMessage } from "@/types/websocket";

export const parseServerMessage = (data: string): ServerMessage | null => {
  try {
    const json = JSON.parse(data);
    const result = ServerMessageSchema.safeParse(json);
    if (!result.success) {
      console.warn("Invalid server message:", result.error);
      return null;
    }
    return result.data;
  } catch {
    console.warn("Non-JSON WebSocket message:", data);
    return null;
  }
};

export const nextTurn = (
  currentTurn: "E" | "S" | "W" | "N",
): "E" | "S" | "W" | "N" => {
  const turns: ("E" | "S" | "W" | "N")[] = ["E", "S", "W", "N"];
  const currentIndex = turns.indexOf(currentTurn);
  const nextIndex = (currentIndex + 1) % turns.length;
  return turns[nextIndex]!;
};
