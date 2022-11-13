import { getGame } from "../../global/games";
import { SocketType } from "../../types";
import { GetGame } from "../../../src/types/sockets/socket";
import { prisma } from "../../global/prisma";

export async function onGameGet(
  this: SocketType,
  { gameId }: { gameId: string },
  cb: (data: GetGame) => void
) {
  try {
    const socket = this;
    const game = getGame(gameId);
    // console.log("goood", game);

    if (!game) {
      const prismaGame = await prisma.game.findFirst({ where: { id: gameId } });
      console.log(prismaGame);
      return;
    }

    socket.join(`game${gameId}`);
    const pgn = game.chess.pgn();
    const { white, black, time, result } = game;

    cb({ white, black, time, pgn, result });
  } catch (error) {
    console.log(error);
  }
}
