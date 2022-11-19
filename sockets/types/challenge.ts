export interface GetChallenge {
  user: string;
  rating: number;
  control: string;
  socketId: string;
  filters: { min: number; max: number };
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
