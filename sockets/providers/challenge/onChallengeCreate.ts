import { prisma } from "../../global/prisma";
import { getSuitableChallenges } from "../../services/challenge/getSuitableChallenges";
import { CHALLENGES } from "../../variables/redisIndex";
import type { SocketType } from "../../types";
import { io } from "../../global/io";

import { GetChallenge } from "../../../src/types/home/Challenge";
import { createGame } from "../../services/game/createGame";
import { redis } from "../../global/redis";

export async function onChallengeCreate(this: SocketType, data: any) {
  try {
    const socket = this;

    const { control } = data;
    const user = await prisma.user.findFirst({
      where: { id: socket.data.id },
      select: { rating: true, filters: true },
    });
    if (!user) throw Error("User not found");

    const challenge: Partial<GetChallenge> = {
      user: socket.data.username,
      rating: +user?.rating,
      control,
      socketId: socket.id,
      // @ts-ignore
      filters: {
        // @ts-ignore
        min: user.filters.min == -500 ? 0 : user.filters.min + +user?.rating,
        // @ts-ignore
        max: user.filters.max == 500 ? 5000 : user.filters.max + +user?.rating,
      },
    };

    let ratingFilter: { min: number; max: number } = {
      // @ts-ignore
      min: user.filters.min,
      // @ts-ignore
      max: user.filters.max,
    };
    if (ratingFilter.max == 500 && ratingFilter.min == -500)
      ratingFilter = { min: 0, max: 5000 };
    else {
      ratingFilter.max = ratingFilter.max + +user.rating;
      ratingFilter.min = ratingFilter.min + +user.rating;
    }
    const existChallenges: GetChallenge[] = await getSuitableChallenges({
      min: ratingFilter.min,
      max: ratingFilter.max,
      control,
      rating: +user?.rating,
    });

    if (existChallenges?.length) {
      const choosenChallenge = existChallenges[0];
      const [socket2] = await io
        .in(`${choosenChallenge.socketId}`)
        .fetchSockets();

      await createGame({
        sockets: [socket, socket2],
        data: {
          white: { user: socket.data.username, rating: user.rating },
          black: { user: socket2.data.username, rating: 2000 },
          control,
        },
      });
      console.log("Start the game", socket.id, socket2.id);
      /* ... */
      return;
    }
    console.log(challenge);

    const status = await redis.json.set(
      CHALLENGES,
      `${socket.data.username}`,
      challenge
    );

    if (status) io.to("challenges").emit("challenge:created", challenge);
  } catch (error) {
    console.log(error);
  }
}
