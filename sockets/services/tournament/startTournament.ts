import { prisma } from "../../global/prisma";
import { redis } from "../../global/redis";
import { setTournament } from "../../global/tournament";
import { TournamentSwiss } from "../../types/tournament";
import { PLAYER_IN_GAME_REDIS } from "../../variables/redisIndex";
import { createGame } from "../game/createGame";
import { Swiss } from "./pairingSwiss";
import type { PlayerSwiss, MatchSwiss } from "../../types/tournament";

export async function startTournament(tournamentId: string) {
  console.log("start tournament");
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: { participants: true },
  });

  //   tournament?.participants.

  if (tournament?.format == "swiss") {
    const players: PlayerSwiss[] = [];
    const prismaQueries: Promise<any>[] = [];

    tournament.participants.forEach((user, index) => {
      const player: PlayerSwiss = {
        id: user.username,
        score: 0,
        rating: user.rating,
        colors: index % 2,
      };
      players.push(player);
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

    const pairings: MatchSwiss[] = Swiss(players, 1, true);

    const tournamentSwiss: TournamentSwiss = {
      players,
      matches: pairings,
    };
    await setTournament(tournamentId, tournamentSwiss);

    pairings.forEach(async (pair) => {
      if (!pair.player2 || !pair.player1) return;
      const gameId = await createGame({
        data: {
          white: { username: pair.player1.id, rating: pair.player1.rating },
          black: { username: pair.player2.id, rating: pair.player2.rating },
          control: tournament.control,
        },
      });

      //   socket.emit("game:started", { gameId: gameId });
      // socket2.emit("game:started", { gameId: gameId });
      Promise.all([
        redis.SADD(PLAYER_IN_GAME_REDIS(pair.player1.id), gameId),
        redis.SADD(PLAYER_IN_GAME_REDIS(pair.player2.id), gameId),
      ]);
    });

    console.log(pairings);
  }
}
