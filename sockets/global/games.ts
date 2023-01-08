import type { Game } from "../types/game";
import { GAMES_REDIS } from "../variables/redisIndex";
import { redis } from "./redis";
import { deleteGameTimer } from "./timers";
import { METHOD_TO_GET_GAME } from "../variables/redisIndex";
export const games: { [id: string]: Game } = {};

export function getGame(gameId: string): [Game] {
  if (METHOD_TO_GET_GAME == "memory") return [games[gameId]];
  // @ts-ignore
  return redis.json.get(GAMES_REDIS, {
    path: `$.${gameId}`,
  });
}

export function setGame(gameId: string, game: Game) {
  if (METHOD_TO_GET_GAME == "memory") return (games[gameId] = game);

  // @ts-ignore
  return redis.json.set(GAMES_REDIS, gameId, game);
}

export function deleteGame(gameId: string) {
  clearTimeout(games[gameId].botTimer);
  deleteGameTimer(gameId);
  if (METHOD_TO_GET_GAME == "memory") return delete games[gameId];

  return redis.json.del(GAMES_REDIS, `$.${gameId}`);
}

export function increasePly(gameId: string) {
  if (METHOD_TO_GET_GAME == "memory") return games[gameId].ply++;

  return redis.json.numIncrBy(GAMES_REDIS, `$.${gameId}.ply`, 1);
}

export function setTimestamp(gameId: string, tsmp: number) {
  if (METHOD_TO_GET_GAME == "memory") return (games[gameId].tsmp = tsmp);

  return redis.json.set(GAMES_REDIS, `$.${gameId}.tsmp`, tsmp);
}

export function setTimeWhite(gameId: string, time: number) {
  if (METHOD_TO_GET_GAME == "memory") return (games[gameId].time[0] = time);

  return redis.json.set(GAMES_REDIS, `$.${gameId}.time[0]`, time);
}

export function setTimeBlack(gameId: string, time: number) {
  if (METHOD_TO_GET_GAME == "memory") return (games[gameId].time[1] = time);

  return redis.json.set(GAMES_REDIS, `$.${gameId}.time[1]`, time);
}

// prettier-ignore
export function setLastOfferDrawStatus(gameId: string, status: "declined") {
  if (METHOD_TO_GET_GAME=="memory") {
    // @ts-ignore
    if(games[gameId].lastOfferDraw) games[gameId].lastOfferDraw.status = status
    return
  }

  return redis.json.set(GAMES_REDIS, `$.${gameId}.lastOfferDraw.status`, status);
}

// prettier-ignore
export function setLastOfferDraw({gameId,username,ply}:{gameId:string, username:string, ply:number}) {
  if (METHOD_TO_GET_GAME == "memory") return games[gameId].lastOfferDraw = {username, ply}
  
  return redis.json.set(GAMES_REDIS, `$.${gameId}.lastOfferDraw`, {username, ply})
}

// prettier-ignore
// export function setGamePgn({gameId,pgn}:{gameId:string, pgn:string}) {
//   if(METHOD_TO_GET_GAME == "memory") throw Error("This method is not needed")
//   return redis.json.set(GAMES_REDIS, `$.${gameId}.pgn`, pgn)
// }
