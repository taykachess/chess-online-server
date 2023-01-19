import type { Result, Player } from './game'

import type { ChallengeFilters } from './challenge'
import { MatchResults, TimePeriods } from '../zod/schemas'
import type { Prisma } from '@prisma/client'
import { prisma } from '../global/prisma'

// prettier-ignore
// eslint-disable-next-line @typescript-eslint/ban-types
export type Match = Prisma.MatchGetPayload<{}, typeof prisma["$extends"]["extArgs"]>;

export { MatchResults, TimePeriods }

export type MatchFilters = ChallengeFilters

export type MatchGame = {
  white: string
  black: string
  result: Result
  gameId: string
}

// export type MatchStatus = "created" | "running" | "armageddon" | "finished";

// export interface Match {
//   player1: string;
//   player2: string;
//   rounds: number;
//   games: MatchGame[];
//   armageddon: boolean;
//   result: [number, number, number];
//   status: MatchStatus;
//   control: string;
// }

// export interface Matches {
//   [id: string]: Match;
// }

// export interface GetMatch {
//   user: string;
//   rating: number;
//   control: string;
//   socketId: string;
//   filters: MatchFilters;
//   rounds: number;
// }

type Minutes = number
type TimeControl = string

export interface MatchCreateDto {
  player: string
  control: string
  type: 'bestof' | 'time'
  periods: [Minutes, TimeControl][]
  // controls: string[];
}

export interface MatchCreateDtoExtended extends MatchCreateDto {
  sender: Player
  // receiver: Player;
}

// export type Stage = number;
// export type MatchResultElement = [string, Result, Stage];
