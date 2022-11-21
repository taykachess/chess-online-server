export interface ChallengeFilters {
  rating: [number, number];
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

// link?: string;
//     records: string[];
//     registered?: boolean;
//     onClick?: () => any;
