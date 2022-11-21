import type { Match, MatchGame } from "../types/match";
import { MATCHES_IN_PROGRESS_REDIS } from "../variables/redisIndex";
import { redis } from "./redis";

export function getMatch(matchId: string): Promise<Match> {
  // @ts-ignore
  return redis.json.get(MATCHES_IN_PROGRESS_REDIS, { path: matchId });
}

export function setMatch(matchId: string, match: Match) {
  // @ts-ignore
  return redis.json.set(MATCHES_IN_PROGRESS_REDIS, matchId, match);
}

export function addGame(matchId: string, game: MatchGame) {
  const resultIndex =
    game.result == "1-0"
      ? 0
      : game.result == "0-1"
      ? 1
      : game.result == "0.5-0.5"
      ? 2
      : -1;

  if (resultIndex == -1) throw Error("result is wrong");
  return Promise.all([
    redis.json.ARRAPPEND(MATCHES_IN_PROGRESS_REDIS, `$.${matchId}.games`, game),
    redis.json.numIncrBy(
      MATCHES_IN_PROGRESS_REDIS,
      `$.${matchId}.result[${resultIndex}]`,
      1
    ),
  ]);
}
