import { deleteGame, getGame } from "../../global/games";
import { io } from "../../global/io";
import { prisma } from "../../global/prisma";

export async function onGameOver({
  gameId,
  result,
}: {
  gameId: string;
  result: string;
}) {
  console.log("Game over", result);
  const game = getGame(gameId);

  game.chess.header("Result", result);
  game.chess.header("Site", "online");
  await prisma.game.create({
    data: {
      id: gameId,
      pgn: game.chess.pgn(),
      players: {
        connect: [
          { username: game.white.username },
          { username: game.black.username },
        ],
      },
    },
  });
  io.to(`game${gameId}`).emit("game:end", { result });
  io.socketsLeave(`game${gameId}`);
  deleteGame(gameId);
  return;
}
