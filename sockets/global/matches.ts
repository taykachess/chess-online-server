import type { Match, Matches } from "../types/match";
import { MATCHES } from "../variables/redisIndex";
import { redis } from "./redis";

export function getMatch(matchId: string) {
  return redis.json.get(MATCHES, { path: matchId });
}

export function setMatch(matchId: string, match: Match) {
  // @ts-ignore
  return redis.json.set(MATCHES, matchId, match);
}
