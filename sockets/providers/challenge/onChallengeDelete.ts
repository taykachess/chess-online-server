import { delJsonRedis } from "../../services/redis/delJsonRedis";
import { CHALLENGES } from "../../variables/redisIndex";
import { io } from "../../global/io";

import type { SocketType } from "../../types";

export async function onChallengeDelete(this: SocketType) {
  const socket = this;

  const status = await delJsonRedis({
    index: CHALLENGES,
    path: `$.${socket.data.username ? socket.data.username : socket.id}`,
  });

  if (status)
    io.to("challenges").emit("challenge:deleted", { socketId: socket.id });
}
