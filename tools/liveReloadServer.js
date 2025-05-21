// tools/liveReloadServer.js
import { WebSocketServer } from "ws";

export const startLiveReloadServer = () => {
  const wss = new WebSocketServer({ port: 35729 }); // Default livereload port

  console.log("LiveReload WebSocket listening on ws://localhost:35729");

  return {
    broadcast(message) {
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(message);
        }
      });
    },
    close() {
      wss.close();
    },
  };
};
