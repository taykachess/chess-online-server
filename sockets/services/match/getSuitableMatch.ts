import { redis } from '../../global/redis'

import { MATCHES_REDIS } from '../../variables/redisIndex'
import { GetMatch } from '../../types/match'

export async function getSuitableMatch({ max, min, control, rating, rounds }: { max: number; min: number; control: string; rating: number; rounds: number }): Promise<GetMatch[]> {
  //  @ts-ignore
  const matches: GetMatch[] = await redis.json.get(MATCHES_REDIS, {
    path: `$.[?(((((@.rating>=${min}&&@.rating<=${max})&&@.control=="${control}")&&@.filters.rating[0]<=${rating})&&@.filters.rating[1]>=${rating})&&@.rounds==${rounds})]`,
  })
  return matches
}
