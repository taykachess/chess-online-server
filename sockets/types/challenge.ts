export interface Filters {
  rating: [number, number];
}

export interface GetChallenge {
  user: string;
  rating: number;
  control: string;
  socketId: string;
  filters: Filters;
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
