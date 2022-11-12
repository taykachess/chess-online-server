import { redis } from "../../global/redis";
import { CHALLENGES } from "../../variables/redisIndex";

interface Filters {
  min: number;
  max: number;
  control: string;
}
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
  console.log(max, min, control, rating);
  //  @ts-ignore
  const challenges: any[] = await redis.json.get(CHALLENGES, {
    path: `$.[?((((@.rating>=${min}&&@.rating<=${max})&&@.control=="${control}")&&@.filters.min<=${rating})&&@.filters.max>=${rating})]`,
  });
  console.log("Challenges goods ", challenges);
  return challenges;
}
