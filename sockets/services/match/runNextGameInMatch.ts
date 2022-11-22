import { getMatch } from "../../global/matches";
import { createGame } from "../game/createGame";
import { getMatchStatus } from "./getMatchStatus";
import { prisma } from "../../global/prisma";
import { io } from "../../global/io";
import { redis } from "../../global/redis";
import { MATCH_ROOM, PLAYER_IN_GAME_REDIS } from "../../variables/redisIndex";
import { Match } from "../../types/match";

export async function runNextGameInMatch({
  matchId,
  match,
}: {
  matchId: string;
  match: Match;
}) {
  const status = getMatchStatus(match);

  const player1 = await prisma.user.findUnique({
    where: { username: match.player1 },
    select: { rating: true, username: true, title: true },
  });
  if (!player1) throw Error("User not found");

  const player2 = await prisma.user.findUnique({
    where: { username: match.player2 },
    select: { rating: true, username: true, title: true },
  });
  if (!player2) throw Error("User not found");

  console.log(status);
  if (status == "running") {
    let pairing;
    if (match.games[match.games.length - 1].white == player1.username) {
      pairing = {
        black: { ...player1, rating: Number(player1.rating) },
        white: { ...player2, rating: Number(player2.rating) },
      };
    } else {
      pairing = {
        white: { ...player1, rating: Number(player1.rating) },
        black: { ...player2, rating: Number(player2.rating) },
      };
    }

    // reverse color two players
    const gameId = await createGame({
      data: {
        ...pairing,
        control: match.control,
        matchId: matchId,
      },
    });

    io.to(MATCH_ROOM(matchId)).emit("game:started", { gameId });

    Promise.all([
      redis.SADD(PLAYER_IN_GAME_REDIS(match.player1), gameId),
      redis.SADD(PLAYER_IN_GAME_REDIS(match.player2), gameId),
    ]);
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
