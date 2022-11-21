import { redis } from "../../global/redis";

import { CHALLENGES_REDIS } from "../../variables/redisIndex";
import type { GetChallenge } from "../../types/challenge";

export async function getSuitableChallenges({
  max,
  min,
  control,
  rating,
}: {
  max: number;
  min: number;
  control: string;
  rating: number;
}): Promise<GetChallenge[]> {
  console.log({ min, max, control, rating });
  //  @ts-ignore
  const challenges: GetChallenge[] = await redis.json.get(CHALLENGES_REDIS, {
    path: `$.[?((((@.rating>=${min}&&@.rating<=${max})&&@.control=="${control}")&&@.filters.rating[0]<=${rating})&&@.filters.rating[1]>=${rating})]`,
  });
  return challenges;
}
