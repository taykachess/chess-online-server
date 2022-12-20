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

export async function addGame(
  matchId: string,
  game: MatchGame,
  match: Match
): Promise<Match> {
  function returnIndex(match: Match, game: MatchGame) {
    if (match.player1 == game.white) {
      if (game.result == "1") return 0;
      else if (game.result == "0") return 1;
      else if (game.result == "0.5") return 2;
    } else if (match.player1 == game.black) {
      if (game.result == "1") return 1;
      else if (game.result == "0") return 0;
      else if (game.result == "0.5") return 2;
    }
    return -1;
  }

  const resultIndex = returnIndex(match, game);

  if (resultIndex == -1) throw Error("result is wrong");
  await Promise.all([
    redis.json.ARRAPPEND(MATCHES_IN_PROGRESS_REDIS, `$.${matchId}.games`, game),
    redis.json.numIncrBy(
      MATCHES_IN_PROGRESS_REDIS,
      `$.${matchId}.result[${resultIndex}]`,
      1
    ),
  ]);
  match.result[resultIndex] = match.result[resultIndex] + 1;
  match.games.push(game);

  return match;
}

export function deleteMatch(matchId: string) {
  return redis.json.del(MATCHES_IN_PROGRESS_REDIS, matchId);
}
