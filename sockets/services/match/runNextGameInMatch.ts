import { getMatch } from "../../global/matches";
import { createGame } from "../game/createGame";
import { getMatchStatus } from "./getMatchStatus";
import { prisma } from "../../global/prisma";
export async function runNextGameInMatch({ matchId }: { matchId: string }) {
  const match = await getMatch(matchId);
  const status = getMatchStatus(match);

  const white = await prisma.user.findUnique({
    where: { username: match.player1 },
    select: { rating: true, username: true, title: true },
  });
  if (!white) throw Error("User not found");

  const black = await prisma.user.findUnique({
    where: { username: match.player2 },
    select: { rating: true, username: true, title: true },
  });
  if (!black) throw Error("User not found");

  if (status == "running") {
    const gameId = await createGame({
      data: {
        white: { ...white, rating: Number(white.rating) },
        black: { ...black, rating: Number(black.rating) },
        control: match.control,
        matchId: matchId,
      },
    });
  }

  if (status == "finished") {
    //     id         String  @unique
    //   player1    String?
    //   player2    String?
    //   rounds     Int
    //   result     Json?
    //   status     String  @default("created")
    //   armageddon Boolean @default(false)
    //   games      Game[]
    const gameIds: { id: string }[] = [];
    match.games.forEach((game) => {
      gameIds.push({ id: game.gameId });
    });
    await prisma.match.create({
      data: {
        id: matchId,
        rounds: match.rounds,
        result: match.result,
        status,
        games: { connect: gameIds },
      },
    });
  }
}
