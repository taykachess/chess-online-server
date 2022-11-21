import { Server } from "socket.io";
import { App } from "uWebSockets.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types/sockets";
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>({
  cors: { origin: "*" },
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const app = new App();

io.attachApp(app);

export { io, app };
