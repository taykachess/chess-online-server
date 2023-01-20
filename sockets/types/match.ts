import type { Player } from './game'

import { MatchResults, TimePeriods } from '../zod/schemas'
import type { Prisma } from '@prisma/client'
import { prisma } from '../global/prisma'

// eslint-disable-next-line @typescript-eslint/ban-types
export type Match = Prisma.MatchGetPayload<{}, typeof prisma['$extends']['extArgs']>

export { MatchResults, TimePeriods }

type Minutes = number
type TimeControl = string

export interface MatchCreateDto {
  player: string
  control: string
  type: 'bestof' | 'time'
  periods: [Minutes, TimeControl][]
}

export interface MatchCreateDtoExtended extends MatchCreateDto {
  sender: Player
}
