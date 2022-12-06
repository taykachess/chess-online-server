import { Chess } from "chess.js";
import { getGame } from "../../global/games";
import { prisma } from "../../global/prisma";
import { GetGame } from "../../types/game";

export async function getGameForFrontend({ gameId }: { gameId: string }) {
  const [game] = await getGame(gameId);

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
    return prismaGame;
  }

  const chess = new Chess();
  //   @ts-ignore
  chess.loadPgn(game.pgn);
  // const pgn = game.chess.pgn();
  const { white, black, time, result } = game;

  const turn = chess.turn();
  const timeWithDifference: [number, number] = [time[0], time[1]];
  if (turn == "w") {
    timeWithDifference[0] =
      timeWithDifference[0] - (new Date().getTime() - game.tsmp);
  } else {
    timeWithDifference[1] =
      timeWithDifference[1] - (new Date().getTime() - game.tsmp);
  }

  const callbackData: GetGame = {
    white,
    black,
    time: timeWithDifference,
    pgn: game.pgn,
    result,
    increment: game.increment,
    lastOfferDraw: game.lastOfferDraw,
  };

  if (game.matchId) callbackData.matchId = game.matchId;

  return callbackData;
}
