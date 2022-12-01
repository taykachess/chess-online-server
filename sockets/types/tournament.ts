import type { TournamentStatus } from "@prisma/client";
import type { Title, Result } from "./game";

export interface TournamentTable {
  id: string;
  name: string;
  _count: {
    participants: number;
  };
  format: string;
  control: string;
  playerLimit: number;
  status: TournamentStatus;
  // participants: Prisma.UserSelect;
  // players: { id: string }[];
  startTime: Date;
}

export type TournamentTableRecord = {
  link: string;
  records: string[];
  registered: boolean;
};

export type GetTournament = {
  name: string;
  description: string;
  status: "registration" | "running" | "finished";
  format: string;
  control: string;
  startTime: Date;
  participants: {
    username: string;
    rating: number;
    title?: Title | null;
  }[];
  organizer: {
    username: string;
    title: Title | null;
  };

  players?: PlayerSwiss[];
  rounds?: number | null;
  currentRound?: number | null;
  standing?: number;
};

// export interface GetTournamentSwiss extends GetTournament {
//   rounds: number | null;
//   currentRound: number;
//   standing?: number;
// }

export interface PlayerSwiss {
  // GameIds
  id: string;
  score: number;
  colors: number;
  pairedUpDown?: boolean;
  receivedBye?: boolean;
  avoid: string[];
  rating: number;
  title?: Title | null;
  matches?: MatchSwissShort[];
  coefficient: Record<Coefficient, number>;
}

export interface PlayerSwissFrontend extends PlayerSwiss {
  uuid?: string;
  place?: string;
}

export type Coefficient = "buchholz";

export interface Match {
  round?: number;
  // board means
  match?: number;
}

export type PlayerInsideMatch = {
  id: string;
  rating: number;
  score: number;
  title?: Title | null;
};
// White, Black, Result, gameId
export type MatchSwiss = [
  PlayerInsideMatch,
  PlayerInsideMatch | null,
  Result,
  string | null
];

export type MatchSwissShort = [
  { id: string; rating: number; title?: Title | null; res: 1 | 0 | 0.5 | "*" },
  string | null
];

export interface MatchRobin extends Match {
  player1: string | null;
  player2: string | null;
}

export interface MatchElimination extends Match {
  player1: string | null;
  player2: string | null;
  win?: {
    round: number;
    match: number;
  };
  loss?: {
    round: number;
    match: number;
  };
}

export interface TournamentSwiss {
  players: Record<string, PlayerSwiss>;
  matches: MatchSwiss[][];
  activeGames: number;
  round: number;
  maxRounds: number;
}
