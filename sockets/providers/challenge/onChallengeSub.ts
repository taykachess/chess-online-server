import type { SocketType } from "../../types/sockets";

export function onChallengeSub(this: SocketType) {
  const socket = this;
  socket.join("challenges");
}
