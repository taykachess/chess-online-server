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
  // Needed for inside memory use
  chess: Chess;
  // Needed for inside memory use
  timerId: any;
  ply: number;
  tsmp: number;
  increment: number;
  result: Result;
  control: string;
  lastOfferDraw?: { username: string; ply: number; status?: "declined" };
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

export function increasePly(gameId: string) {
  games[gameId].ply = games[gameId].ply + 1;
}
