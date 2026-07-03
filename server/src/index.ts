import { serve } from "bun";
import { parseClientMessage } from "./lib/utils";

const server = serve({
  port: 8000,
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      const messageString = typeof message === "string" ? message : new TextDecoder().decode(message);
      const clientMessage = parseClientMessage(messageString);
      if (!clientMessage) {
        ws.send("Invalid message");
        return;
      }

      switch (clientMessage.type) {
        case "ping":
          ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
          break;
      }
    }, // a message is received
    open(ws) {}, // a socket is opened
    close(ws, code, message) {}, // a socket is closed
    drain(ws) {}, // the socket is ready to receive more data
  },
});

console.log(`🚀 Server listening at ${server.url}`);
