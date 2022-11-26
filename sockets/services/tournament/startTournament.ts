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
    const players: Record<string, PlayerSwiss> = {};
    const prismaQueries: Promise<any>[] = [];

    tournament.participants.forEach((user, index) => {
      const player: PlayerSwiss = {
        id: user.username,
        score: 0,
        rating: user.rating,
        title: user.title,
        colors: index % 2,
      };

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

    const pairings: MatchSwiss[] = Swiss(Object.values(players), true);

    const matches: Record<string, MatchSwiss> = {};

    const tournamentSwiss: TournamentSwiss = {
      players,
      matches: [pairings],
      activeGames: pairings.length,
    };
    await setTournament(tournamentId, tournamentSwiss);

    pairings.forEach(async (pair, index) => {
      if (!pair[1]) return;

      // const white = await prisma.user.findFirst({
      //   where: { username: pair[0] },
      //   select: { rating: true, title: true },
      // });
      // const black = await prisma.user.findFirst({
      //   where: { username: pair[1] },
      //   select: { rating: true, title: true },
      // });

      // if(!white || !black) return
      const gameId = await createGame({
        data: {
          white: {
            username: pair[0],
            rating: players[pair[0]].rating,
            title: players[pair[0]].title,
          },
          black: {
            username: pair[1],
            rating: players[pair[1]].rating,
            title: players[pair[1]].title,
          },
          control: tournament.control,
          tournamentId,
          round: 1,
          board: index + 1,
        },
      });

      // matches[gameId] = pair

      //   socket.emit("game:started", { gameId: gameId });
      // socket2.emit("game:started", { gameId: gameId });
      Promise.all([
        redis.SADD(PLAYER_IN_GAME_REDIS(pair[0]), gameId),
        redis.SADD(PLAYER_IN_GAME_REDIS(pair[1]), gameId),
      ]);
    });

    console.log(pairings);
  }
}
