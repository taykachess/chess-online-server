import { deleteGame, getGame } from "../../global/games";
import { io } from "../../global/io";
import { prisma } from "../../global/prisma";

import { calculateRating } from "./calculateRating";

import { GAMEROOM, PLAYERINGAME } from "../../variables/redisIndex";

import type { Result } from "../../types/game";
import { redis } from "../../global/redis";
import { addResult, getMatch } from "../../global/matches";
import { MatchGame } from "../../types/match";

export async function onGameOver({
  gameId,
  result,
}: {
  gameId: string;
  result: Result;
}) {
  console.log("Game over", result);
  const game = getGame(gameId);
  // game.white.rating, game.black.rating, game.result,
  const { newEloBlack, newEloWhite } = calculateRating({
    eloWhite: game.white.rating,
    eloBlack: game.black.rating,
    result: result,
    control: game.control,
  });
  game.white.ratingNext = newEloWhite;
  game.black.ratingNext = newEloBlack;

  const createGame = prisma.game.create({
    data: {
      id: gameId,
      pgn: game.chess.pgn(),
      // @ts-ignore
      white: game.white,
      // @ts-ignore
      black: game.black,
      players: {
        connect: [
          { username: game.white.username },
          { username: game.black.username },
        ],
      },
      result,
      time: game.time,
      control: game.control,
    },
  });

  const updateRatingWhite = prisma.user.update({
    where: { username: game.white.username },
    data: { rating: newEloWhite },
  });

  const updateRatingBlack = prisma.user.update({
    where: { username: game.black.username },
    data: { rating: newEloBlack },
  });

  await prisma.$transaction([createGame, updateRatingWhite, updateRatingBlack]);

  io.to(GAMEROOM(gameId)).emit("game:end", {
    result,
    newEloWhite,
    newEloBlack,
  });
  io.socketsLeave(GAMEROOM(gameId));

  if (game.matchId) {
    const matchResult: MatchGame = {
      white: game.white.username,
      black: game.black.username,
      result,
      gameId,
    };
    await addResult(game.matchId, matchResult);
    const match = await getMatch(game.matchId);
  }
  deleteGame(gameId);

  // await Promise.all([
  redis.SREM(PLAYERINGAME(game.white.username), gameId);
  redis.SREM(PLAYERINGAME(game.black.username), gameId);
  // ]);
}
