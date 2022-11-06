import { createClient } from "redis";
import { Emitter } from "@socket.io/redis-emitter";

const redis = createClient();

await redis.connect();
const emitter = new Emitter(redis);

export { redis, emitter };
