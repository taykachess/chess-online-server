import { io } from "../../global/io";
import { redis } from "../../global/redis";
import { SocketType } from "../../types/sockets";
import { MATCHES_REDIS_GOT, USER_ROOM } from "../../variables/redisIndex";

export async function onMatchRefusePrivate(this: SocketType, player: string) {
  const socket = this;

  try {
    if (!socket.data.username) throw Error("403");
    const status = await redis.hDel(
      MATCHES_REDIS_GOT(socket.data.username),
      `${player}`
    );

    if (status == 1)
      io.to(USER_ROOM(player)).emit("match:private:refuse", player);
  } catch (error) {
    console.log(error);
  }
}
