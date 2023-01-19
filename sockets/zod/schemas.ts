import { z } from 'zod'

export type TimePeriods = z.infer<typeof TimePeriods>
export const TimePeriods = z.tuple([z.number(), z.string()]).array()

export type MatchResults = z.infer<typeof MatchResults>
export const MatchResults = z.array(z.tuple([z.string(), z.enum(['1', '0', '0.5', '+', '-', '*']), z.number()]))

export type Player = z.infer<typeof Player>
export const Player = z.object({
  username: z.string(),
  rating: z.number(),
  ratingNext: z.number().optional(),
  title: z.enum(['GM', 'IM']).optional(),
  bot: z.boolean().optional(),
})
