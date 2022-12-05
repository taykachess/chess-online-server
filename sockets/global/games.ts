import type { Game, Games } from "../types/game";
import { GAMES_REDIS } from "../variables/redisIndex";
import { redis } from "./redis";
import { deleteGameTimer } from "./timers";

// const games: Games = {};
// const timers: { games: { [id: string]: { timerId: any } } } = {
//   games: {},
// };

export function getGame(gameId: string): Promise<[Game]> {
  // console.log("getGame", gameId);

  // @ts-ignore
  return redis.json.get(GAMES_REDIS, {
    path: `$.${gameId}`,
  });
  // return games[gameId];
}

export function setGame(gameId: string, game: Game) {
  // console.log("game set", gameId);
  // @ts-ignore
  return redis.json.set(GAMES_REDIS, gameId, game);
  // games[gameId] = game;
}

// export function setNextRating(
//   gameId: string,
//   rating: number,
//   color: "w" | "b"
// ) {
//   if (color == "w")
//     return redis.json.set(GAMES_REDIS, `$.${gameId}.white.ratingNext`, rating);
//   return redis.json.set(GAMES_REDIS, `$.${gameId}.black.ratingNext`, rating);
// }

export function deleteGame(gameId: string) {
  // console.log("delete", gameId);
  deleteGameTimer(gameId);
  return redis.json.del(GAMES_REDIS, `$.${gameId}`);
  // delete games[gameId];
}

// export function setGameTimeout(gameId: string, fn: any, milliseconds: number) {
//   clearTimeout(timers.games[gameId].timerId);
//   const timerId = setTimeout(fn, milliseconds);
//   timers.games[gameId].timerId = timerId;
// }

export function increasePly(gameId: string) {
  // console.log("increasePly", gameId);
  return redis.json.numIncrBy(GAMES_REDIS, `$.${gameId}.ply`, 1);
  // games[gameId].ply = games[gameId].ply + 1;
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
  // .lastOfferDraw.status
  return redis.json.set(GAMES_REDIS, `$.${gameId}.lastOfferDraw.status`, status);
}

// prettier-ignore
export function setLastOfferDraw({gameId,username,ply}:{gameId:string, username:string, ply:number}) {
  // game.lastOfferDraw = { username: socket.data.username, ply: game.ply };
  // 
  return redis.json.set(GAMES_REDIS, `$.${gameId}.lastOfferDraw`, {username, ply})
}

// prettier-ignore
export function setGamePgn({gameId,pgn}:{gameId:string, pgn:string}) {
  return redis.json.set(GAMES_REDIS, `$.${gameId}.pgn`, pgn)
}
