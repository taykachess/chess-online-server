import { io } from "../../global/io";
import { prisma } from "../../global/prisma";
import { redis } from "../../global/redis";
import { MatchCreateDto, MatchCreateDtoExtended } from "../../types/match";
import { SocketType } from "../../types/sockets";
import { MATCHES_REDIS_GOT, USER_ROOM } from "../../variables/redisIndex";

export async function onMatchCreatePrivate(
  this: SocketType,
  match: MatchCreateDto
) {
  // const match = (await request.json()) as MatchCreateDto;
  const socket = this;

  try {
    const friend = await prisma.user.findUnique({
      where: {
        username: match.player,
      },
      select: {
        username: true,
        rating: true,
        title: true,
      },
    });

    if (!friend) throw Error("Not found");

    const me = await prisma.user.findUnique({
      where: {
        username: socket.data.username,
      },
      select: {
        username: true,
        rating: true,
        title: true,
      },
    });

    if (!me) throw Error("Not found");
    if (me.username == friend.username) throw Error("The same user");

    const extendedMatch: MatchCreateDtoExtended = {
      ...match,
      sender: me,
    };

    socket.data.matchSended = friend.username;

    const status = await redis.hSet(
      MATCHES_REDIS_GOT(friend.username),
      `${me.username}`,
      JSON.stringify(extendedMatch)
    );

    // if (status==1) {
    console.log("OK", status);

    io.to(USER_ROOM(friend.username)).emit("match:private:create", extendedMatch)

    // }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // prettier-ignore
    // const status2 = await redis.hSet(MATCHES_REDIS_GOT(match.player),
    //   `${match.player}`,
    //   match
    // );
  } catch (error) {
    console.log(error);
  }
}
