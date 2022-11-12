import { SocketType } from "../types";
import { onGameGet } from "../providers/game/onGameGet";
import { onMove } from "../providers/game/onMove";

export function gameController(socket: SocketType) {
  try {
    socket.on("game:get", onGameGet);

    // Only for room challenges
    socket.on("game:move", onMove);

    // Auth only
    if (!socket.data.id) return console.log("Next auth is required");
    // socket.on("challenge:create", onChallengeCreate);
    // socket.on("challenge:cancel", onChallengeDelete);
  } catch (error) {
    console.log(error);
  }
}
