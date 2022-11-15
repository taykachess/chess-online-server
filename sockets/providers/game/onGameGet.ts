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
      const prismaGame = await prisma.game.findFirst({
        where: { id: gameId },
        select: {
          white: true,
          black: true,
          time: true,
          result: true,
          pgn: true,
        },
      });
      console.log(prismaGame);
      // @ts-ignore
      return cb({ ...prismaGame });
    }

    socket.join(`game${gameId}`);
    const pgn = game.chess.pgn();
    const { white, black, time, result } = game;

    const turn = game.chess.turn();
    const timeWithDifference: [number, number] = [time[0], time[1]];
    if (turn == "w") {
      timeWithDifference[0] =
        timeWithDifference[0] - (new Date().getTime() - game.tsmp);
    } else {
      timeWithDifference[1] =
        timeWithDifference[1] - (new Date().getTime() - game.tsmp);
    }

    cb({ white, black, time: timeWithDifference, pgn, result });
  } catch (error) {
    console.log(error);
  }
}
