import { redis } from "../../global/redis";
import { PLAYERINGAME } from "../../variables/redisIndex";

import type { SocketRemoteType, SocketType } from "../../types/sockets";

export function afterCreateGame({
  socket,
  socket2,
  gameId,
}: {
  socket: SocketType;
  socket2: SocketRemoteType;
  gameId: string;
}) {
  socket.emit("game:started", { gameId: gameId });
  socket2.emit("game:started", { gameId: gameId });

  return Promise.all([
    //   @ts-ignore
    redis.SADD(PLAYERINGAME(socket.data.username), gameId),
    redis.SADD(PLAYERINGAME(socket2.data.username), gameId),
  ]);
}
