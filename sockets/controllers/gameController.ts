import { SocketType } from "../types/sockets";
import { onGameGet } from "../providers/game/onGameGet";
import { onMove } from "../providers/game/onMove";
import { onResign } from "../providers/game/onResign";
import { onDrawOffer } from "../providers/game/onDrawOffer";
import { onDrawAccept } from "../providers/game/onDrawAccept";
import { onDrawDecline } from "../providers/game/onDrawDecline";

export function gameController(socket: SocketType) {
  try {
    socket.on("game:get", onGameGet);

    // Only for room challenges
    socket.on("game:move", onMove);
    socket.on("game:resign", onResign);
    socket.on("game:drawOffer", onDrawOffer);
    socket.on("game:drawAccept", onDrawAccept);
    socket.on("game:drawDecline", onDrawDecline);

    // Auth only
    if (!socket.data.id) return console.log("Next auth is required");
    // socket.on("challenge:create", onChallengeCreate);
    // socket.on("challenge:cancel", onChallengeDelete);
  } catch (error) {
    console.log(error);
  }
}
