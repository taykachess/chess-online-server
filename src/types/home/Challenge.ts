export interface GetChallenge {
  user: string;
  rating: number;
  control: string;
  socketId: string;
  filters: { min: number; max: number };
}
