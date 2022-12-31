export interface ChallengeFilters {
  rating: [number, number];
  control: string;
}

export interface GetChallenge {
  user: string;
  rating: number;
  control: string;
  socketId: string;
  filters: ChallengeFilters;
}

export type ChallengeTableRecord = {
  link?: string;
  records: string[];
  registered?: boolean;
  onClick?: () => any;
};
