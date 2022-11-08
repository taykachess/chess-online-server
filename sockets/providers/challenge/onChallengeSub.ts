import type { SocketType } from "../../types";

export function onChallengeSub(this: SocketType) {
  const socket = this;
  socket.join("challenges");
}
