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
  format: string;
  control: string;
  startTime: Date;
  participants: {
    username: string;
    rating: number;
    title: Title | null;
  }[];
  organizer: {
    username: string;
    title: Title | null;
  };
};

export interface PlayerSwissInside {
  id: string;
  score: number;
  colors: number;
  pairedUpDown?: boolean;
  receivedBye?: boolean;
  avoid?: string[];
  rating: number;
  title?: Title | null;
}

export interface PlayerSwiss extends PlayerSwissInside {
  // GameIds
  matches?: string[];
}

export interface Match {
  round?: number;
  // board means
  match?: number;
}

export type MatchSwiss = [string, string | null, Result, number, number];

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
