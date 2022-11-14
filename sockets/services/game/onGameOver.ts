import { deleteGame, getGame, Result } from "../../global/games";
import { io } from "../../global/io";
import { prisma } from "../../global/prisma";
import { calculateRating } from "./calculateRating";

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

  await prisma.game.create({
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
  io.to(`game${gameId}`).emit("game:end", { result });
  io.socketsLeave(`game${gameId}`);
  deleteGame(gameId);
  return;
}
