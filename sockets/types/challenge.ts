export interface GetChallenge {
  user: string;
  rating: number;
  control: string;
  socketId: string;
  filters: { min: number; max: number };
}

export type ChallengeTableRecord = {
  records: string[];
  registered: boolean;
  onClick: () => any;
};
