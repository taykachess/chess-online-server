import { onTournamentLeave } from "../providers/tournament/onTournamentLeave";
import { onTournamentSub } from "../providers/tournament/onTournamentSub";
import type { SocketType } from "../types/sockets";

export function tournamentController(socket: SocketType) {
  try {
    socket.on("tournament:subscribe", onTournamentSub);
    socket.on("tournament:leave", onTournamentLeave);
    // Auth only
    if (!socket.data?.id) return console.log("Next auth is required");
  } catch (error) {
    console.log(error);
  }
}
