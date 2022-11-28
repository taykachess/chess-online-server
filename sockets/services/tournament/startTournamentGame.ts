import { redis } from "../../global/redis";

import {
  decreaseTournamentActiveGameByOne,
  increasePlayerScore,
  setPlayerReceivedBye,
} from "../../global/tournament";
import { MatchSwiss } from "../../types/tournament";
import { PLAYER_IN_GAME_REDIS } from "../../variables/redisIndex";
import { createGame } from "../game/createGame";

import type { PlayerSwiss } from "../../types/tournament";
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
    decreaseTournamentActiveGameByOne(tournamentId);
    increasePlayerScore({ tournamentId, username: pair[0], point: 1 });
    // prettier-ignore
    const status = await setPlayerReceivedBye({tournamentId, username:pair[0], receivedBye:true})

    // console.log(status);
    return;
  }

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
      control,
      tournamentId,
      round,
      board,
    },
  });

  // matches[gameId] = pair

  //   socket.emit("game:started", { gameId: gameId });
  // socket2.emit("game:started", { gameId: gameId });
  Promise.all([
    redis.SADD(PLAYER_IN_GAME_REDIS(pair[0]), gameId),
    redis.SADD(PLAYER_IN_GAME_REDIS(pair[1]), gameId),
  ]);
}
