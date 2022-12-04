import { TOURNAMENTS_IN_PROGRESS_REDIS } from "../variables/redisIndex";
import { redis } from "./redis";

import type {
  MatchSwiss,
  MatchSwissShort,
  PlayerSwiss,
  TournamentSwiss,
} from "../types/tournament";
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

export function getTournamentMaxRound(tournamentId: string): number[] {
  // @ts-ignore
  return redis.json.get(TOURNAMENTS_IN_PROGRESS_REDIS, {
    path: `$.${tournamentId}.maxRounds`,
  });
}

export function setTournamentActiveGames(
  tournamentId: string,
  activeGames: number
) {
  return redis.json.set(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.activeGames`,
    activeGames
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
  return redis.json.set(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.matches[${round - 1}][${board - 1}][2]`,
    result
  );
}

export function getTournamentMatches({
  tournamentId,
}: {
  tournamentId: string;
}) {
  return redis.json.get(TOURNAMENTS_IN_PROGRESS_REDIS, {
    path: `$.${tournamentId}.matches`,
  });
}

export function addTournamentMatch({
  tournamentId,
  matches,
}: {
  tournamentId: string;
  matches: MatchSwiss[];
}) {
  return redis.json.arrAppend(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.matches`,
    matches
  );
}

export function increaseTournamentRound(tournamentId: string): number[] {
  // @ts-ignore
  return redis.json.numIncrBy(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.round`,
    1
  );
}

// Tournament player section

export function getAllPlayers({
  tournamentId,
}: {
  tournamentId: string;
}): Promise<Record<string, PlayerSwiss>[]> {
  // @ts-ignore
  return redis.json.get(TOURNAMENTS_IN_PROGRESS_REDIS, {
    path: `$.${tournamentId}.players`,
  });
}

export function getActivePlayers({
  tournamentId,
}: {
  tournamentId: string;
}): Promise<PlayerSwiss[]> {
  // @ts-ignore
  return redis.json.get(TOURNAMENTS_IN_PROGRESS_REDIS, {
    path: `$.${tournamentId}.players.[?(@.active==true)]`,
  });
}

export function getPlayerScore({
  tournamentId,
  username,
}: {
  tournamentId: string;
  username: string;
}): Promise<number> {
  // @ts-ignore
  return redis.json.get(TOURNAMENTS_IN_PROGRESS_REDIS, {
    path: `$.${tournamentId}.players["${username}"].score`,
  });
}

export function increasePlayerScore({
  tournamentId,
  username,
  point,
}: {
  tournamentId: string;
  username: string;
  point: 1 | 0.5;
}) {
  return redis.json.numIncrBy(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.players["${username}"].score`,
    point
  );
}

export function increasePlayerColorsByOne({
  tournamentId,
  username,
}: {
  tournamentId: string;
  username: string;
}) {
  return redis.json.numIncrBy(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.players["${username}"].colors`,
    1
  );
}

export function addPlayerAvoid({
  tournamentId,
  username,
  playerId,
}: {
  tournamentId: string;
  username: string;
  playerId: string;
}) {
  return redis.json.arrAppend(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.players["${username}"].avoid`,
    playerId
  );
}

export function addPlayerMatches({
  tournamentId,
  username,
  game,
}: {
  tournamentId: string;
  username: string;
  game: MatchSwissShort;
}) {
  return redis.json.arrAppend(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.players["${username}"].matches`,
    game
  );
}

// pairedUpDown

export function setPlayerPairedUpDown({
  tournamentId,
  username,
  pairedUpDown,
}: {
  tournamentId: string;
  username: string;
  pairedUpDown: boolean;
}) {
  return redis.json.arrAppend(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.players["${username}"].pairedUpDown`,
    pairedUpDown
  );
}

export function setPlayerReceivedBye({
  tournamentId,
  username,
  receivedBye,
}: {
  tournamentId: string;
  username: string;
  receivedBye: boolean;
}) {
  return redis.json.set(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.players["${username}"].receivedBye`,
    receivedBye
  );
}

export function setPlayerCoefficientBuchholz({
  tournamentId,
  username,
  buchholz,
}: {
  tournamentId: string;
  username: string;
  buchholz: number;
}) {
  console.log(tournamentId, username, buchholz);
  return redis.json.set(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    `$.${tournamentId}.players["${username}"].coefficient.buchholz`,
    buchholz
  );
}
