import { createClient } from "redis";

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

(async () => {
  //   New object must be created first
  await redis.json.set("challenges", `$`, {});
})();

export { redis };
