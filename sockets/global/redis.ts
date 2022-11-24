import { createClient } from "redis";
import { MATCHES_IN_PROGRESS_REDIS } from "../variables/redisIndex";
const redis = createClient();

(async () => {
  redis.on("error", (err) => console.log("Redis Client Error", err));
  await redis.connect();
})();

if (process.env.NODE_ENV == "dev") {
  console.log("Redis cleared");
  (async () => {
    await redis.flushAll();
  })();
}

// redis.pubsub

(async () => {
  const data = {};
  //   New object must be created first
  await redis.json.set("challenges", `$`, data);
  await redis.json.set("games", `$`, {});
  await redis.json.set("matches", `$`, {});
  await redis.json.set("matchesinprogress", `$`, {});
})();

export { redis };
