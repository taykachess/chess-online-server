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
  console.log({ min, max, control, rating });
  //  @ts-ignore
  const challenges: any[] = await redis.json.get(CHALLENGES, {
    path: `$.[?((((@.rating>=${min}&&@.rating<=${max})&&@.control=="${control}")&&@.filters.rating[0]<=${rating})&&@.filters.rating[1]>=${rating})]`,
  });
  return challenges;
}
