import { Chess } from "chess.js";
import { getGame } from "../../global/games";
import { prisma } from "../../global/prisma";
import { GetGame } from "../../types/game";
import { TOURNAMENT_GAME_PREPARE_TIME } from "../../variables/redisIndex";

export async function getGameForFrontend({ gameId }: { gameId: string }) {
  const [game] = getGame(gameId);

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

  const chess = game.chess;
  //   @ts-ignore
  // chess.loadPgn(game.pgn);
  // const pgn = game.chess.pgn();
  const { white, black, time, result } = game;

  const turn = chess.turn();
  const timeWithDifference: [number, number] = [time[0], time[1]];
  const now = Date.now();
  const gameProcessTime = now - game.tsmp;
  if (game.tournamentId && game.ply == 0) {
    if (gameProcessTime < TOURNAMENT_GAME_PREPARE_TIME) {
      // console.log("do nothing");
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
    pgn: game.chess.pgn(),
    result,
    increment: game.increment,
    lastOfferDraw: game.lastOfferDraw,
    tsmp: game.tsmp,
  };

  if (game.matchId) callbackData.matchId = game.matchId;

  return callbackData;
}
