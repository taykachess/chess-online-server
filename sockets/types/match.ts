import type { Result } from "./game";

export interface Match {
  player1: string;
  player2: string;
  rounds: number;
  result: { white: string; black: string; result: Result; gameId: string }[];
  armageddon: boolean;
}

export interface Matches {
  [id: string]: Match;
}
