import type { Player } from './game'

import { MatchResults, TimePeriods } from '../zod/schemas'
import type { MatchType, Prisma } from '@prisma/client'
import { prisma } from '../global/prisma'

// eslint-disable-next-line @typescript-eslint/ban-types
export type Match = Prisma.MatchGetPayload<{}, typeof prisma['$extends']['extArgs']>

export { MatchResults, TimePeriods }

type Minutes = number
type TimeControl = string
type Rounds = number

export interface MatchCreate {
  player: string
  control: string
  type: MatchType
  rounds: number
  periods: [Minutes | Rounds, TimeControl][]
  // roundPeriods: [Rounds, TimeControl][]
}
export type MatchCreateTimeDto = Pick<MatchCreate, 'player' | 'periods' | 'type'>
export type MatchCreateBestOfDto = Pick<MatchCreate, 'player' | 'periods' | 'type'>

export interface MatchCreateTimeDtoExtended extends MatchCreateTimeDto {
  sender: Player
}
