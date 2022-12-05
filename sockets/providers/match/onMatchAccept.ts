import { io } from "../../global/io";
import { redis } from "../../global/redis";
import { prisma } from "../../global/prisma";

import { createGame } from "../../services/game/createGame";

import {
  MATCHES_REDIS,
  PLAYER_IN_GAME_REDIS,
} from "../../variables/redisIndex";

import type { GetMatch } from "../../types/match";
import type { SocketType } from "../../types/sockets";
import { createMatch } from "../../services/match/createMatch";

export async function onMatchAccept(
  this: SocketType,
  { username }: { username: string }
) {
  const socket = this;

  try {
    //   @ts-ignore
    const match: GetMatch = await redis.json.get(MATCHES_REDIS, {
      path: username,
    });

    if (!match) throw Error("Match not found");

    if (match.socketId == socket.id)
      throw Error("You can't accept your own match");

    const [socket2] = await io.in(`${match.socketId}`).fetchSockets();

    if (!socket.data?.username || !socket2.data?.username)
      throw Error("The both user must have username");

    const user = await prisma.user.findFirst({
      where: { username: socket.data.username },
      select: { rating: true, title: true },
    });
    const userOpponent = await prisma.user.findFirst({
      where: { username: socket2.data.username },
      select: { rating: true, title: true },
    });
    if (!userOpponent || !user) throw Error("User not found");

    const white = {
      username: socket.data.username,
      rating: +user.rating,
      title: user.title,
    };

    const black = {
      username: socket2.data.username,
      rating: +userOpponent?.rating,
      title: userOpponent.title,
    };

    const matchId = await createMatch({
      createMatchDto: {
        white,
        black,
        control: match.control,
        rounds: match.rounds,
        armageddon: false,
      },
    });

    const gameId = await createGame({
      data: {
        white,
        black,
        control: match.control,
        matchId,
      },
    });

    socket.emit("game:started", { gameId: gameId });
    socket2.emit("game:started", { gameId: gameId });
    Promise.all([
      redis.SADD(PLAYER_IN_GAME_REDIS(socket.data.username), gameId),
      redis.SADD(PLAYER_IN_GAME_REDIS(socket2.data.username), gameId),
      redis.json.del(MATCHES_REDIS, `$.${socket.data.username}`),
      redis.json.del(MATCHES_REDIS, `$.${socket2.data.username}`),
    ]);
  } catch (error) {
    console.error(error);
  }
}
