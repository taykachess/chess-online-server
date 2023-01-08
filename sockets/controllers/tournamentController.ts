import { onTournamentLeave } from "../providers/tournament/onTournamentLeave";
import { onTournamentSub } from "../providers/tournament/onTournamentSub";
import type { SocketType } from "../types/sockets";

export function tournamentController(socket: SocketType) {
  try {
    socket.on("tournament:subscribe", onTournamentSub);
    socket.on("tournament:leave", onTournamentLeave);
    // Auth only
    if (!socket.data?.username) return;
  } catch (error) {
    // console.log(error);
  }
}
