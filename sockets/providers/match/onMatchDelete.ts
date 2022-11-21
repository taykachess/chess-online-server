import { io } from "../../global/io";
import { redis } from "../../global/redis";

import { MATCHES_REDIS, MATCHES_ROOM } from "../../variables/redisIndex";

import type { SocketType } from "../../types/sockets";

export async function onMatchDelete(this: SocketType) {
  const socket = this;
  const status = await redis.json.del(
    MATCHES_REDIS,
    `$.${socket.data.username ? socket.data.username : socket.id}`
  );
  if (status)
    io.to(MATCHES_ROOM).emit("match:deleted", { socketId: socket.id });
}
