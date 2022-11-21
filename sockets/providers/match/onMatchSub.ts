import type { SocketType } from "../../types/sockets";
import { MATCHES_ROOM } from "../../variables/redisIndex";

export function onMatchSub(this: SocketType) {
  const socket = this;
  socket.join(MATCHES_ROOM);
}
