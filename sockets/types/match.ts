import type { Result } from "./game";

export type MatchGame = {
  white: string;
  black: string;
  result: Result;
  gameId: string;
};

export type MatchStatus = "created" | "running" | "armageddon" | "finished";

export interface Match {
  player1: string;
  player2: string;
  rounds: number;
  games: MatchGame[];
  armageddon: boolean;
  result: [number, number, number];
  status: MatchStatus;
  control: string;
}

export interface Matches {
  [id: string]: Match;
}
