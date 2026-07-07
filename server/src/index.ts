import { serve } from "bun";
import { parseClientMessage } from "./lib/utils";
import { Timer } from "./timer";

const timer = new Timer(3, 10, 3);

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
      const messageString =
        typeof message === "string"
          ? message
          : new TextDecoder().decode(message);
      const clientMessage = parseClientMessage(messageString);
      if (!clientMessage) {
        ws.send("Invalid message");
        return;
      }

      // const onTimeout = () => {
      //   ws.send(
      //     JSON.stringify({
      //       type: "set_turn",
      //       currentTurn: timer.getCurrentTurn(),
      //     })
      //   );
      // };

      const sendState = () => {
        ws.send(
          JSON.stringify({
            type: "state",
            currentTurn: timer.getCurrentTurn(),
            extraTimers: timer.getExtraTimers(),
            hasStarted: timer.getHasStarted(),
            state: timer.getState(),
          }),
        );
      };

      const onTimeout = sendState;

      try {
        switch (clientMessage.type) {
          case "ping":
            ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
            break;
          case "state":
            sendState();
            break;
          case "join":
            ws.send(
              JSON.stringify({
                type: "set_player",
                player: clientMessage.player,
              }),
            );
            break;
          case "start":
            timer.start(onTimeout);
            sendState();
            break;
          case "reset":
            timer.reset();
            sendState();
            break;
          case "pon":
            timer.call(clientMessage.caller, "pon", onTimeout);
            sendState();
            break;
          case "chii":
            timer.call(clientMessage.caller, "chii", onTimeout);
            sendState();
            break;
          case "kan":
            timer.call(clientMessage.caller, "kan", onTimeout);
            sendState();
            break;
          case "ron":
            timer.ron(clientMessage.caller);
            sendState();
            break;
          case "skip":
            timer.voteSkip(clientMessage.caller);
            sendState();
            break;
          case "riichi":
            timer.riichi(clientMessage.caller, onTimeout);
            sendState();
            break;
          case "tsumo":
            timer.tsumo(clientMessage.caller);
            sendState();
            break;
          case "discard":
            timer.discard(onTimeout);
            sendState();
            break;
        }
      } catch (e) {
        if (e instanceof Error) {
          ws.send(e.message);
        } else {
          throw e;
        }
      }
    }, // a message is received
    open(ws) {}, // a socket is opened
    close(ws, code, message) {}, // a socket is closed
    drain(ws) {}, // the socket is ready to receive more data
  },
});

console.log(`🚀 Server listening at ${server.url}`);
