import { onMatchSub } from "../providers/match/onMatchSub";
import { onMatchCreate } from "../providers/match/onMatchCreate";
import { onMatchDelete } from "../providers/match/onMatchDelete";
import { onMatchAccept } from "../providers/match/onMatchAccept";

import type { SocketType } from "../types/sockets";

export function matchController(socket: SocketType) {
  try {
    socket.on("match:subscribe", onMatchSub);

    // Auth only
    if (!socket.data?.username) return console.log("Next auth is required");
    socket.on("match:create", onMatchCreate);
    socket.on("match:cancel", onMatchDelete);
    socket.on("match:accept", onMatchAccept);

    // Only for room challenges
  } catch (error) {
    console.log(error);
  }
}
