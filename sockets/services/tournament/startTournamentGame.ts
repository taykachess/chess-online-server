import { redis } from "../../global/redis";

import {
  addPlayerMatches,
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
        },
        "",
      ],
    });
    // prettier-ignore
    setPlayerReceivedBye({tournamentId, username:pair[0].id, receivedBye:true})
    return;
  }

  const gameId = await createGame({
    data: {
      white: {
        username: pair[0].id,
        rating: players[pair[0].id].rating,
        title: players[pair[0].id].title,
      },
      black: {
        username: pair[1].id,
        rating: players[pair[1].id].rating,
        title: players[pair[1].id].title,
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
    redis.SADD(PLAYER_IN_GAME_REDIS(pair[0].id), gameId),
    redis.SADD(PLAYER_IN_GAME_REDIS(pair[1].id), gameId),
  ]);

  return gameId;
}
