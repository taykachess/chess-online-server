import { prisma } from "../../global/prisma";
import { io } from "../../global/io";
import { redis } from "../../global/redis";

import { getSuitableChallenges } from "../../services/challenge/getSuitableChallenges";
import { createGame } from "../../services/game/createGame";

import {
  CHALLENGES_REDIS,
  CHALLENGES_ROOM,
  PLAYER_IN_GAME_REDIS,
} from "../../variables/redisIndex";

import type { ChallengeFilters, GetChallenge } from "../../types/challenge";
import type { SocketType } from "../../types/sockets";

export async function onChallengeCreate(
  this: SocketType,
  data: { control: string; filters: ChallengeFilters }
) {
  try {
    const socket = this;
    const { control, filters } = data;
    if (!socket.data.username) throw Error("User not found");

    const user = await prisma.user.findFirst({
      where: { username: socket.data.username },
      select: { rating: true, title: true },
    });
    if (!user) throw Error("User not found");

    const ratingFilter: { min: number; max: number } = {
      min: filters.rating[0],
      max: filters.rating[1],
    };
    if (ratingFilter.max == 500) ratingFilter.max = 5000;
    else ratingFilter.max = ratingFilter.max + +user.rating;

    if (ratingFilter.min == -500) ratingFilter.min = 0;
    else ratingFilter.min = ratingFilter.min + +user.rating;

    const challenge: GetChallenge = {
      user: socket.data.username,
      rating: +user?.rating,
      control,
      socketId: socket.id,
      // @ts-ignore
      filters: {
        rating: [ratingFilter.min, ratingFilter.max],
      },
    };

    const existChallenges: GetChallenge[] = await getSuitableChallenges({
      min: ratingFilter.min,
      max: ratingFilter.max,
      control,
      rating: +user?.rating,
    });

    if (
      existChallenges?.length &&
      existChallenges[0].user != socket.data.username
    ) {
      const choosenChallenge = existChallenges[0];
      const [socket2] = await io
        .in(`${choosenChallenge.socketId}`)
        .fetchSockets();

      if (!socket.data?.username || !socket2.data?.username)
        throw Error("The both user must have username");
      const userOpponent = await prisma.user.findFirst({
        where: { username: socket2.data.username },
        select: { rating: true, title: true },
      });
      if (!userOpponent) throw Error("User not found");

      const gameId = await createGame({
        data: {
          white: {
            username: socket.data.username,
            rating: +user.rating,
            title: user.title,
          },
          black: {
            username: socket2.data.username,
            rating: +userOpponent?.rating,
            title: userOpponent.title,
          },
          control,
        },
      });

      socket.emit("game:started", { gameId: gameId });
      socket2.emit("game:started", { gameId: gameId });

      return Promise.all([
        redis.SADD(PLAYER_IN_GAME_REDIS(socket.data.username), gameId),
        redis.SADD(PLAYER_IN_GAME_REDIS(socket2.data.username), gameId),
        redis.json.del(CHALLENGES_REDIS, `$.${socket.data.username}`),
        redis.json.del(CHALLENGES_REDIS, `$.${socket2.data.username}`),
      ]);
    }
    // prettier-ignore
    // @ts-ignore
    const status = await redis.json.set(CHALLENGES_REDIS,`${socket.data.username}`,challenge);

    if (status) io.to(CHALLENGES_ROOM).emit("challenge:created", challenge);
  } catch (error) {
    // console.log(error);
  }
}
