import { SocketServer, SocketType } from "../types";
import { onChallengeCreate } from "../providers/challenge/onChallengeCreate";
import { onChallengeSub } from "../providers/challenge/onChallengeSub";
import { onChallengeDelete } from "../providers/challenge/onChallengeDelete";

export function challengeController(io: SocketServer, socket: SocketType) {
  try {
    socket.on("challenge:subscribe", onChallengeSub);

    // Auth only
    if (!socket.data.id) return console.log("Next auth is required");
    socket.on("challenge:create", onChallengeCreate);
    socket.on("challenge:cancel", onChallengeDelete);

    // Only for room challenges
  } catch (error) {
    console.log(error);
  }
}
