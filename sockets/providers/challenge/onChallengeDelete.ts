import { CHALLENGES } from "../../variables/redisIndex";
import { io } from "../../global/io";

import type { SocketType } from "../../types";
import { redis } from "../../global/redis";

export async function onChallengeDelete(this: SocketType) {
  const socket = this;
  const status = await redis.json.del(
    CHALLENGES,
    `$.${socket.data.username ? socket.data.username : socket.id}`
  );
  if (status)
    io.to("challenges").emit("challenge:deleted", { socketId: socket.id });
}
