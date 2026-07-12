import { serve, ServerWebSocket } from "bun";
import { parseClientMessage } from "./lib/utils";
import { Seats } from "./seats";
import { Timer } from "./timer";

const timer = new Timer(10, 60, 10);
const seats = new Seats();
const sockets = new Set<ServerWebSocket<unknown>>();

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

      const sendState = () => {
        for (const socket of sockets) {
          socket.send(
            JSON.stringify({
              type: "state",
              currentTurn: timer.getCurrentTurn(),
              discardTimer: timer.getDiscardTimer(),
              callTimer: timer.getCallTimer(),
              extraTimers: timer.getExtraTimers(),
              extraTimerIsRunning: timer.getExtraTimerIsRunning(),
              hasStarted: timer.getHasStarted(),
              state: timer.getState(),
              callCount: timer.getCallCount(),
              riichiPlayers: Array.from(timer.getRiichiPlayers()),
              nonMenzenchinPlayers: Array.from(timer.getNonMenzenchinPlayers()),
              skipVotes: timer.getSkipVotes(),
            }),
          );
        }
      };

      const sendSeats = () => {
        for (const socket of sockets) {
          socket.send(
            JSON.stringify({
              type: "seats",
              seats: seats.getSeats(),
            }),
          );
        }
      };

      const onTimeout = sendState;

      try {
        switch (clientMessage.type) {
          case "ping":
            ws.send(JSON.stringify({ type: "pong" }));
            break;
          case "state":
            sendState();
            break;
          case "seats":
            sendSeats();
            break;
          case "join":
            seats.join(clientMessage.clientId, clientMessage.player);
            ws.send(
              JSON.stringify({
                type: "set_player",
                player: clientMessage.player,
              }),
            );
            sendSeats();
            break;
          case "leave":
            seats.leave(clientMessage.clientId);
            sendSeats();
            break;
          case "request_client_id":
            ws.send(
              JSON.stringify({
                type: "client_id",
                id: crypto.randomUUID(),
              }),
            );
            break;
          case "start":
            if (!seats.canStart()) {
              throw new Error("All four seats must be taken before starting");
            }
            timer.start(onTimeout);
            sendState();
            break;
          case "reset":
            timer.reset();
            seats.reset();
            sendState();
            sendSeats();
            break;
          case "rotate_seats":
            seats.rotateSeats();
            sendSeats();
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
            timer.voteSkip(clientMessage.caller, sendState, onTimeout);
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
    open(ws) {
      sockets.add(ws);
      ws.send(
        JSON.stringify({
          type: "state",
          currentTurn: timer.getCurrentTurn(),
          discardTimer: timer.getDiscardTimer(),
          callTimer: timer.getCallTimer(),
          extraTimers: timer.getExtraTimers(),
          extraTimerIsRunning: timer.getExtraTimerIsRunning(),
          hasStarted: timer.getHasStarted(),
          state: timer.getState(),
          callCount: timer.getCallCount(),
          riichiPlayers: Array.from(timer.getRiichiPlayers()),
          nonMenzenchinPlayers: Array.from(timer.getNonMenzenchinPlayers()),
          skipVotes: timer.getSkipVotes(),
        }),
      );
      ws.send(
        JSON.stringify({
          type: "seats",
          seats: seats.getSeats(),
        }),
      );
      ws.send(
        JSON.stringify({
          type: "settings",
          discardTime: timer.getDiscardTime(),
          extraTime: timer.getExtraTime(),
          callTime: timer.getCallTime(),
        }),
      );
    }, // a socket is opened
    close(ws, code, message) {
      sockets.delete(ws);
    }, // a socket is closed
    drain(ws) { }, // the socket is ready to receive more data
  },
});

console.log(`🚀 Server listening at ${server.url}`);
