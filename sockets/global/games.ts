import type { Game } from "../types/game";
import { GAMES_REDIS } from "../variables/redisIndex";
import { redis } from "./redis";
import { deleteGameTimer } from "./timers";

export function getGame(gameId: string): Promise<[Game]> {
  // @ts-ignore
  return redis.json.get(GAMES_REDIS, {
    path: `$.${gameId}`,
  });
}

export function setGame(gameId: string, game: Game) {
  // @ts-ignore
  return redis.json.set(GAMES_REDIS, gameId, game);
}

export function deleteGame(gameId: string) {
  deleteGameTimer(gameId);
  return redis.json.del(GAMES_REDIS, `$.${gameId}`);
}

export function increasePly(gameId: string) {
  return redis.json.numIncrBy(GAMES_REDIS, `$.${gameId}.ply`, 1);
}

export function setTimestamp(gameId: string, tsmp: number) {
  return redis.json.set(GAMES_REDIS, `$.${gameId}.tsmp`, tsmp);
}

export function setTimeWhite(gameId: string, time: number) {
  return redis.json.set(GAMES_REDIS, `$.${gameId}.time[0]`, time);
}

export function setTimeBlack(gameId: string, time: number) {
  return redis.json.set(GAMES_REDIS, `$.${gameId}.time[1]`, time);
}

// prettier-ignore
export function setLastOfferDrawStatus(gameId: string, status: "declined") {
  return redis.json.set(GAMES_REDIS, `$.${gameId}.lastOfferDraw.status`, status);
}

// prettier-ignore
export function setLastOfferDraw({gameId,username,ply}:{gameId:string, username:string, ply:number}) {
  return redis.json.set(GAMES_REDIS, `$.${gameId}.lastOfferDraw`, {username, ply})
}

// prettier-ignore
export function setGamePgn({gameId,pgn}:{gameId:string, pgn:string}) {
  return redis.json.set(GAMES_REDIS, `$.${gameId}.pgn`, pgn)
}
