import { prisma } from "../../global/prisma";
import { setTournament } from "../../global/tournament";
import { TournamentSwiss } from "../../types/tournament";

import { pairingSwiss } from "./pairingSwiss";
import type { PlayerSwiss, MatchSwiss } from "../../types/tournament";
import { startTournamentGame } from "./startTournamentGame";
import { io } from "../../global/io";
import { TOURNAMENT_ROOM } from "../../variables/redisIndex";

export async function startTournament(tournamentId: string) {
  // console.log("start tournament");
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: { participants: true },
  });
  if (!tournament) throw Error("Tournament not found");
  if (!tournament.rounds) throw Error("rounds not include");

  //   tournament?.participants.

  if (tournament?.format == "swiss") {
    io.to(TOURNAMENT_ROOM(tournamentId)).emit("tournament:start");

    const players: Record<string, PlayerSwiss> = {};
    const prismaQueries: Promise<any>[] = [];
    tournament.participants.sort((a, b) => b.rating - a.rating);

    tournament.participants.forEach((user, index) => {
      const player: PlayerSwiss = {
        id: user.username,
        score: 0,
        rating: user.rating,
        colors: index % 2,
        avoid: [],
        matches: [],
        pairedUpDown: false,
        receivedBye: false,
      };
      console.log("sorted", player);

      if (user.title) player.title = user.title;
      players[user.username] = player;
      //   const updateQuery = prisma.tournament.update({
      //     where: {
      //       id: tournamentId,
      //     },
      //     data: {
      //       players: { push: player },
      //     },
      //   });
      //   prismaQueries.push(updateQuery);
    });

    // await Promise.all(prismaQueries);

    // Жеребьевка

    const pairings: MatchSwiss[] = pairingSwiss(Object.values(players), true);

    const matches: Record<string, MatchSwiss> = {};

    const tournamentSwiss: TournamentSwiss = {
      players,
      matches: [pairings],
      activeGames: pairings.length,
      round: 1,
      maxRounds: tournament.rounds,
    };
    await setTournament(tournamentId, tournamentSwiss);

    pairings.forEach(async (pair, index) => {
      startTournamentGame({
        pair,
        tournamentId,
        players,
        board: index + 1,
        control: tournament.control,
        round: tournamentSwiss.round,
      });
    });

    console.log(pairings);
  }
}
