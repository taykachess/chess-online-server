import { Chess } from "chess.js";

interface Game {
  time: [w: number, b: number];
  white: string;
  black: string;
  chess: Chess;
  timerId: any;
  ply: number;
  tsmp: number;
  increment: number;
}
interface Games {
  [id: string]: Game;
}

const games: Games = {};

export function getGame(gameId: string) {
  return games[gameId];
}

export function setGame(gameId: string, game: Game) {
  games[gameId] = game;
}

export function deleteGame(gameId: string) {
  console.log(games[gameId]);
  clearTimeout(games[gameId].timerId);
  delete games[gameId];
  console.log(games[gameId]);
}

export function setGameTimeout(gameId: string, fn: any, miliseconds: number) {
  clearTimeout(games[gameId].timerId);
  const timerId = setTimeout(fn, miliseconds);
  games[gameId].timerId = timerId;
}
