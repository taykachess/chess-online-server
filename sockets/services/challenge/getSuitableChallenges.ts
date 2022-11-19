import { redis } from "../../global/redis";

import { CHALLENGES } from "../../variables/redisIndex";

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
}) {
  //  @ts-ignore
  const challenges: any[] = await redis.json.get(CHALLENGES, {
    path: `$.[?((((@.rating>=${min}&&@.rating<=${max})&&@.control=="${control}")&&@.filters.min<=${rating})&&@.filters.max>=${rating})]`,
  });
  return challenges;
}
