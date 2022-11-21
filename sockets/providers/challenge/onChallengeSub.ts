import type { SocketType } from "../../types/sockets";
import { CHALLENGES_ROOM } from "../../variables/redisIndex";

export function onChallengeSub(this: SocketType) {
  const socket = this;
  socket.join(CHALLENGES_ROOM);
}
