import type { SocketType } from "../../types/sockets";
import { TOURNAMENT_ROOM } from "../../variables/redisIndex";

export function onTournamentSub(
  this: SocketType,
  { tournamentId }: { tournamentId: string }
) {
  try {
    const socket = this;

    socket.join(TOURNAMENT_ROOM(tournamentId));
  } catch (error) {
    // console.log(error);
  }
}
