import { ClientMessage, ClientMessageSchema } from "../types/websocket";

export const parseClientMessage = (data: string): ClientMessage | null => {
  try {
    const json = JSON.parse(data);
    const result = ClientMessageSchema.safeParse(json);
    if (!result.success) {
      console.warn("Invalid client message:", result.error);
      return null;
    }
    return result.data;
  } catch {
    console.warn("Non-JSON WebSocket message:", data);
    return null;
  }
};
