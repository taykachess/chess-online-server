import { z } from 'zod'

export const filterSchema = z.object({
  min: z.number().gte(-500).lte(-50),
  max: z.number().gte(50).lte(500),
})
