import { createClient } from "redis";
// import { TOURNAMENTS_IN_PROGRESS_REDIS } from "../variables/redisIndex";

// import { MATCHES_IN_PROGRESS_REDIS } from "../variables/redisIndex";
const redis = createClient();

const pubClient = createClient();
const subClient = pubClient.duplicate();

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

  await Promise.all([
    redis.json.set("challenges", `$`, data),
    redis.json.set("games", `$`, {}),
    redis.json.set("matches", `$`, {}),
    redis.json.set("matchesinprogress", `$`, {}),
    redis.json.set("tournamentsInProgress", `$`, {}),
  ]);
})();

export { redis, pubClient, subClient };
