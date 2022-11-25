import type { SocketType } from "../../types/sockets";
import { TOURNAMENT_ROOM } from "../../variables/redisIndex";

export function onTournamentLeave(
  this: SocketType,
  { tournamentId }: { tournamentId: string }
) {
  const socket = this;
  socket.leave(TOURNAMENT_ROOM(tournamentId));
}
