import { z } from "zod";

export type TimePeriods = z.infer<typeof TimePeriods>;
export const TimePeriods = z.tuple([z.number(), z.string()]).array();

export type Player = z.infer<typeof Player>;
export const Player = z.object({
  username: z.string(),
  rating: z.number(),
  ratingNext: z.number().optional(),
  title: z.enum(["GM", "IM"]).optional(),
  bot: z.boolean().optional(),
});

export type MatchResult = z.infer<typeof MatchResult>;
export const MatchResult = z.object({
  id: z.string(),
  res: z.enum(["1", "0", "0.5", "+", "-", "*"]),
  player: z.number(),
});
