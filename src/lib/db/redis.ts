import { createClient } from "redis";

const redis = createClient();

await redis.connect();

console.log("Redis");
export { redis };
