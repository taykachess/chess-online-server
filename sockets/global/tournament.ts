import { TOURNAMENTS_IN_PROGRESS_REDIS } from "../variables/redisIndex";
import { redis } from "./redis";

import type { TournamentSwiss } from "../types/tournament";
import { Result } from "../types/game";

export function getTournament(tournamentId: string) {
  return redis.json.get(TOURNAMENTS_IN_PROGRESS_REDIS, {
    path: tournamentId,
  });
}

// prettier-ignore
export function setTournament(tournamentId: string, tournament: TournamentSwiss) {
// @ts-ignore
  return redis.json.set(TOURNAMENTS_IN_PROGRESS_REDIS,tournamentId,tournament);
}

export function decreaseTournamentActiveGameByOne(tournamentId: string) {
  return redis.json.numIncrBy(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.activeGames`,
    -1
  );
}

export function setTournamentMatchResult({
  tournamentId,
  round,
  board,
  result,
}: {
  tournamentId: string;
  round: number;
  board: number;
  result: Result;
}) {
  console.log("setTournamentMatchResult", round, board, result);
  return redis.json.set(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.matches[${round - 1}][${board - 1}][2]`,
    result
  );
}
