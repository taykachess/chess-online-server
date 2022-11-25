import { TOURNAMENTS_IN_PROGRESS_REDIS } from "../variables/redisIndex";
import { redis } from "./redis";

import type { TournamentSwiss } from "../types/tournament";

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
