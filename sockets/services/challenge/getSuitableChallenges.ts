import { redis } from "../../global/redis";
import { CHALLENGES } from "../../variables/redisIndex";

interface Filters {
  min: number;
  max: number;
  control: string;
}
export async function getSuitableChallenges(filters: Filters, rating: number) {
  //  @ts-ignore
  const challenges: any[] = await redis.json.get(CHALLENGES, {
    path: `$.[?((((@.rating>=${filters.min}&&@.rating<=${filters.max})&&@.control=="${filters.control}")&&@.filters.min<=${rating})&&@.filters.max>=${rating})]`,
  });
  console.log("Challenges goods ", challenges);
  return challenges;
}
