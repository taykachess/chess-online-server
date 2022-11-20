import type { Result } from "./game";

export type MatchGame = {
  white: string;
  black: string;
  result: Result;
  gameId: string;
};

export interface Match {
  player1: string;
  player2: string;
  rounds: number;
  games: MatchGame[];
  armageddon: boolean;
  score: [number, number, number];
}

export interface Matches {
  [id: string]: Match;
}
