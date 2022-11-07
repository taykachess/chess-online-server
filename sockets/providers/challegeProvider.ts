import { SocketServer, SocketType } from "../types";
import {
  onChallengeCreate,
  onChallengeSub,
} from "../services/challengeService";
export function challengeProvider(io: SocketServer, socket: SocketType) {
  try {
    socket.on("challenge:subscribe", onChallengeSub);

    if (!socket.data.id) return console.log("Next auth is required");
    socket.on("challenge:create", onChallengeCreate);

    // Only for room challenges
  } catch (error) {
    console.log(error);
  }
}
