import { prisma } from "../../global/prisma";
import { startSwiss } from "./startSwiss";
import { TOURNAMENT_ROOM } from "../../variables/redisIndex";
import { io } from "../../global/io";

export async function startTournament(tournamentId: string) {
  // console.log("start tournament");
  const tournament = await prisma.tournament.update({
    where: { id: tournamentId },
    data: {
      status: "running",
    },
    include: { participants: true },
  });
  if (!tournament) throw Error("Tournament not found");

  if (tournament?.format == "swiss") {
    const { pairings, players } = await startSwiss({
      tournament,
      tournamentId,
    });
    io.to(TOURNAMENT_ROOM(tournamentId)).emit("tournament:start", {
      pairings,
      players,
    });
  }
}
