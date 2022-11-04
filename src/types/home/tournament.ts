export interface getTournament {
  id: string;
  name: string;
  _count: {
    players: number;
  };
  format: string;
  control: string;
  playerLimit: number;
  startTime: Date;
}
