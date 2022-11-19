export interface GetTournament {
  id: string;
  name: string;
  _count: {
    players: number;
  };
  format: string;
  control: string;
  playerLimit: number;
  players: { id: string }[];
  startTime: Date;
}

export type TournamentTableRecord = {
  link: string;
  records: string[];
  registered: boolean;
};
