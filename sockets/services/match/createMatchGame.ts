import { prisma } from "../../global/prisma";
import { Result } from "../../types/game";
import { createGame } from "../game/createGame";

export async function createMatchGame(
  matchId: string,
  gameId: string,
  white: string,
  black: string,
  result: Result
) {
  try {
    const match = await prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        games: {
          connect: {
            id: gameId,
          },
        },
      },
      select: {
        // periods: true,
        // startDate: true,
        tsmp: true,
        stage: true,
        player1: true,
        player2: true,
        periodsData: true,
      },
    });

    if (!match.stage) throw Error("Must be current stage!");
    const res = transformResult(
      result,
      white,
      match.player1,
      gameId,
      match.stage
    );

    await prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        result: {
          push: res,
        },
      },
    });

    if (!match || !match.periodsData || !match.tsmp || !match.stage)
      throw Error("Match not found");

    const now = Date.now();
    const MINUTE_IN_MILLISECONDS = 60 * 1000;
    console.log(match.tsmp);
    // let periodIndex = 0;
    const isPeriodEnded =
      now -
        // @ts-ignore
        Date.parse(match.tsmp) -
        match.periodsData[match.stage - 1][0] * MINUTE_IN_MILLISECONDS >
      0;

    console.log(isPeriodEnded);
    if (isPeriodEnded) {
      if (match.periodsData.length == match.stage) {
        // Check score and use armageddon if set to true

        console.log("Match has finished");

        await prisma.match.update({
          where: {
            id: matchId,
          },
          data: {
            status: "finished",
          },
        });

        return;
      }

      await prisma.match.update({
        where: {
          id: matchId,
        },
        data: {
          stage: { increment: 1 },
          tsmp: new Date(),
        },
      });

      const playerBlack = await prisma.user.findUnique({
        where: { username: white },
        select: { rating: true, username: true, title: true },
      });
      if (!playerBlack) throw Error("User not found");

      const playerWhite = await prisma.user.findUnique({
        where: { username: black },
        select: { rating: true, username: true, title: true },
      });
      if (!playerWhite) throw Error("User not found");

      console.log("match continue with next period");

      await createGame({
        data: {
          white: playerWhite,
          black: playerBlack,
          control: match.periodsData[match.stage - 1][1],
          matchId,
        },
      });
    } else {
      console.log("match continue with the same period");

      await fetchAndCreateGame(
        white,
        black,
        match.periodsData[match.stage - 1][1],
        matchId
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchAndCreateGame(
  white: string,
  black: string,
  control: string,
  matchId: string
) {
  const playerBlack = await prisma.user.findUnique({
    where: { username: white },
    select: { rating: true, username: true, title: true },
  });
  if (!playerBlack) throw Error("User not found");

  const playerWhite = await prisma.user.findUnique({
    where: { username: black },
    select: { rating: true, username: true, title: true },
  });
  if (!playerWhite) throw Error("User not found");

  await createGame({
    data: {
      white: playerWhite,
      black: playerBlack,
      control,
      matchId,
    },
  });
}

type Stage = number;
type MatchResultElement = [string, 1 | 2, Result, Stage];

function transformResult(
  res: Result,
  white: string,
  player1: string,
  gameId: string,
  stage: Stage
): MatchResultElement {
  if (white == player1) return [gameId, 1, res, stage];
  else return [gameId, 2, res, stage];
}
