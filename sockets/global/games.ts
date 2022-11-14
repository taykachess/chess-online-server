import { Chess } from "chess.js";

export interface Player {
  username: string;
  rating: number;
  ratingNext?: number;
}

export type Result = "1-0" | "0.5-0.5" | "0-1" | "*" | "+-" | "-+";

export interface Game {
  time: [w: number, b: number];
  white: Player;
  black: Player;
  chess: Chess;
  timerId: any;
  ply: number;
  tsmp: number;
  increment: number;
  result: Result;
  control: string;
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
  clearTimeout(games[gameId].timerId);
  delete games[gameId];
}

export function setGameTimeout(gameId: string, fn: any, miliseconds: number) {
  clearTimeout(games[gameId].timerId);
  const timerId = setTimeout(fn, miliseconds);
  games[gameId].timerId = timerId;
}
