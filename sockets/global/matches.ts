import type { Match, Matches, MatchGame } from "../types/match";
import { MATCHES } from "../variables/redisIndex";
import { redis } from "./redis";

export function getMatch(matchId: string): Promise<Match> {
  // @ts-ignore
  return redis.json.get(MATCHES, { path: matchId });
}

export function setMatch(matchId: string, match: Match) {
  // @ts-ignore
  return redis.json.set(MATCHES, matchId, match);
}

export function addResult(matchId: string, game: MatchGame) {
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
    redis.json.ARRAPPEND(MATCHES, `$.${matchId}.games`, game),
    redis.json.numIncrBy(MATCHES, `$.${matchId}.score[${resultIndex}]`, 1),
  ]);
}
