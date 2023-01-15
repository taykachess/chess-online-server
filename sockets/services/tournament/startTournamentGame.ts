import { redis } from "../../global/redis";

import {
  addPlayerMatches,
  decreaseTournamentActiveGameByOne,
  increasePlayerScore,
  setPlayerReceivedBye,
} from "../../global/tournament";
import { MatchSwiss } from "../../types/tournament";
import {
  PLAYER_IN_GAME_REDIS,
  TOURNAMENT_GAME_PREPARE_TIME,
  USER_ROOM,
} from "../../variables/redisIndex";
import { createGame } from "../game/createGame";

import type { PlayerSwiss } from "../../types/tournament";
import { io } from "../../global/io";
import { prisma } from "../../global/prisma";
import { onGameStartRandomMode } from "../../providers/game/dev/onGameStartRandomMode";
export async function startTournamentGame({
  pair,
  tournamentId,
  players,
  board,
  control,
  round,
}: {
  pair: MatchSwiss;
  tournamentId: string;
  players: Record<string, PlayerSwiss>;
  board: number;
  round: number;
  control: string;
}) {
  if (!pair[1]) {
    // decreaseTournamentActiveGameByOne(tournamentId);
    increasePlayerScore({ tournamentId, username: pair[0].id, point: 1 });
    addPlayerMatches({
      tournamentId,
      username: pair[0].id,
      game: [
        {
          id: "Bye",
          rating: 0,
          // title: black.title,
          res: 1,
          color: "w",
        },
        "",
      ],
    });
    // prettier-ignore
    setPlayerReceivedBye({tournamentId, username:pair[0].id, receivedBye:true})
    return;
  }

  const [white, black] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { username: pair[0].id },
      select: { rating: true, title: true, bot: true },
    }),
    prisma.user.findUnique({
      where: { username: pair[1].id },
      select: { rating: true, title: true, bot: true },
    }),
  ]);

  if (!white || !black) throw Error("Not white or black");

  const gameId = await createGame({
    data: {
      white: {
        username: pair[0].id,
        ...white,
        // rating: players[pair[0].id].rating,
        // title: players[pair[0].id].title,
      },
      black: {
        username: pair[1].id,
        ...black,
        // rating: players[pair[1].id].rating,
        // title: players[pair[1].id].title,
      },
      control,
      tournamentId,
      round,
      board,
    },
  });

  if (white.bot && gameId)
    setTimeout(() => {
      onGameStartRandomMode({ gameId });
    }, TOURNAMENT_GAME_PREPARE_TIME);

  // io.to([USER_ROOM(pair[0].id), USER_ROOM(pair[1].id)]).emit("game:started", {
  //   gameId,
  // });

  // Promise.all([
  //   redis.SADD(PLAYER_IN_GAME_REDIS(pair[0].id), gameId),
  //   redis.SADD(PLAYER_IN_GAME_REDIS(pair[1].id), gameId),
  // ]);

  return gameId;
}
