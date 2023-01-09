import type { Result, Player } from "./game";

import type { ChallengeFilters } from "./challenge";

export type MatchFilters = ChallengeFilters;

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

export interface GetMatch {
  user: string;
  rating: number;
  control: string;
  socketId: string;
  filters: MatchFilters;
  rounds: number;
}

export interface MatchCreateDto {
  player: string;
  control: string;
  type: "game" | "time";
  timeControls: number[];
  controls: string[];
}

export interface MatchCreateDtoExtended extends MatchCreateDto {
  sender: Player;
  // receiver: Player;
}
