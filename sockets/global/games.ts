import type { Game, Games } from "../types/game";

const games: Games = {};

export function getGame(gameId: string) {
  return games[gameId];
}

export function setGame(gameId: string, game: Game) {
  games[gameId] = game;
}

export function deleteGame(gameId: string) {
  clearTimeout(games[gameId].timerId);
  delete games[gameId];
}

export function setGameTimeout(gameId: string, fn: any, milliseconds: number) {
  clearTimeout(games[gameId].timerId);
  const timerId = setTimeout(fn, milliseconds);
  games[gameId].timerId = timerId;
}

export function increasePly(gameId: string) {
  games[gameId].ply = games[gameId].ply + 1;
}
