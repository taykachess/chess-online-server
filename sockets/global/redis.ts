import { createClient } from "redis";

const redis = createClient();

(async () => {
  redis.on("error", (err) => console.log("Redis Client Error", err));
  await redis.connect();
})();

// if (process.env.NODE_ENV == "dev") {
//   console.log("Redis cleared");
//   (async () => {
//     await redis.flushAll();
//   })();
// }

(async () => {
  const data = {
    tayka3: {
      user: "tayka3",
      rating: 2000,
      control: "1+0",
      socketId: "Hxo-Bb-45loxBPnSAAAB",
      filters: {
        max: 3000,
        min: 2900,
      },
    },
    tayka4: {
      user: "tayka4",
      rating: 2000,
      control: "1+0",
      socketId: "IjcwGpnvyDCPET_NAAAD",
      filters: {
        max: 3000,
        min: 1900,
      },
    },
  };
  //   New object must be created first
  await redis.json.set("challenges", `$`, data);
})();

export { redis };
