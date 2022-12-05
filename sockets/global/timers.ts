import { GAMES_REDIS } from "../variables/redisIndex";
import { redis } from "./redis";
const timers: { games: { [id: string]: any } } = {
  games: {},
};

export function setGameTimeout(gameId: string, fn: any, milliseconds: number) {
  clearTimeout(timers.games[gameId]);
  const timerId = setTimeout(fn, milliseconds);
  timers.games[gameId] = timerId;
}

// prettier-ignore
export function setGameTimeoutInitial(gameId: string, fn: any, milliseconds: number) {
  const timerId = setTimeout(fn, milliseconds);
  timers.games[gameId] = timerId;
}

export function deleteGameTimer(gameId: string) {
  //   console.log(timers.games.entries().length);
  console.log("delete", gameId);
  clearTimeout(timers.games[gameId]);
  delete timers.games[gameId];
  // delete games[gameId];
}
