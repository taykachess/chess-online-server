import { prisma } from "$lib/db/prisma";
import { redis } from "$lib/db/redis";
import {
  GAMES_REDIS,
  TOURNAMENT_GAME_PREPARE_TIME,
} from "$sockets/variables/redisIndex";
import type { Game, GetGame } from "$types/game";
import { json } from "@sveltejs/kit";
import { Chess } from "cm-chess-ts";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [game]: [Game] = await redis.json.get(GAMES_REDIS, {
    path: `$.${params.id}`,
  });

  if (!game) {
    const prismaGame = await prisma.game.findFirst({
      where: { id: params.id },
      select: {
        white: true,
        black: true,
        time: true,
        result: true,
        pgn: true,
      },
    });

    return json(prismaGame);
  }

  const chess = new Chess();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  chess.loadPgn(game.pgn);

  const { white, black, time, result } = game;

  const turn = chess.turn();
  const timeWithDifference: [number, number] = [time[0], time[1]];
  const now = new Date().getTime();
  const gameProcessTime = now - game.tsmp;
  if (game.tournamentId && game.ply == 0) {
    if (gameProcessTime < TOURNAMENT_GAME_PREPARE_TIME) {
      console.log("do nothing");
    } else {
      if (turn == "w") {
        timeWithDifference[0] =
          timeWithDifference[0] -
          gameProcessTime +
          TOURNAMENT_GAME_PREPARE_TIME;
      } else {
        timeWithDifference[1] =
          timeWithDifference[1] -
          gameProcessTime +
          TOURNAMENT_GAME_PREPARE_TIME;
      }
    }
  } else if (turn == "w") {
    timeWithDifference[0] = timeWithDifference[0] - gameProcessTime;
  } else {
    timeWithDifference[1] = timeWithDifference[1] - gameProcessTime;
  }

  const callbackData: GetGame = {
    white,
    black,
    time: timeWithDifference,
    pgn: game.pgn,
    result,
    increment: game.increment,
    lastOfferDraw: game.lastOfferDraw,
    tsmp: game.tsmp,
  };

  if (game.matchId) callbackData.matchId = game.matchId;
  if (game.tournamentId) callbackData.tournamentId = game.tournamentId;

  return json(callbackData);
};
