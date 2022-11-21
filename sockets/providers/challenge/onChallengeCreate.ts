import { prisma } from "../../global/prisma";
import { io } from "../../global/io";
import { redis } from "../../global/redis";

import { getSuitableChallenges } from "../../services/challenge/getSuitableChallenges";
import { createGame } from "../../services/game/createGame";

import { CHALLENGES, PLAYERINGAME } from "../../variables/redisIndex";

import type { Filters, GetChallenge } from "../../types/challenge";
import type { SocketType } from "../../types/sockets";
import { afterCreateGame } from "../../services/game/afterCreatedGame";

export async function onChallengeCreate(
  this: SocketType,
  data: { control: string; filters: Filters }
) {
  try {
    const socket = this;
    const { control, filters } = data;

    console.log("Challenge filters", filters);
    const user = await prisma.user.findFirst({
      where: { id: socket.data.id },
      select: { rating: true, title: true },
    });
    if (!user) throw Error("User not found");

    let ratingFilter: { min: number; max: number } = {
      min: filters.rating[0],
      max: filters.rating[1],
    };
    if (ratingFilter.max == 500 && ratingFilter.min == -500)
      ratingFilter = { min: 0, max: 5000 };
    else {
      ratingFilter.max = ratingFilter.max + +user.rating;
      ratingFilter.min = ratingFilter.min + +user.rating;
    }
    const challenge: Partial<GetChallenge> = {
      user: socket.data.username,
      rating: +user?.rating,
      control,
      socketId: socket.id,
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

    console.log(existChallenges);

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

      return Promise.all([
        afterCreateGame({ socket, socket2, gameId }),
        redis.json.del(CHALLENGES, `$.${socket.data.username}`),
        redis.json.del(CHALLENGES, `$.${socket2.data.username}`),
      ]);
    }
    // prettier-ignore
    // @ts-ignore
    const status = await redis.json.set(CHALLENGES,`${socket.data.username}`,challenge);

    if (status) io.to("challenges").emit("challenge:created", challenge);
  } catch (error) {
    console.log(error);
  }
}
