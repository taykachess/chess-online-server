import type { Prisma } from "@prisma/client";
import type { Title } from "./game";
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
