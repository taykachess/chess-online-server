import { io } from "../../global/io";
import { prisma } from "../../global/prisma";

import {
  addTournamentMatch,
  decreaseTournamentActiveGameByOne,
  getActivePlayers,
  getAllPlayers,
  getPlayerScore,
  getTournamentActiveGames,
  getTournamentMatches,
  getTournamentMaxRound,
  getTournamentTV,
  increaseTournamentRound,
  setTournamentActiveGames,
  setTournamentMatchResult,
  setTournamentTV,
} from "../../global/tournament";
import { Game, Result } from "../../types/game";
import { MatchSwiss } from "../../types/tournament";
import { transformResult } from "../../utils/transformResult";
import { TOURNAMENT_ROOM } from "../../variables/redisIndex";
import { calculateBuchholz } from "./calculateBuchholz";
import { pairingSwiss } from "./pairingSwiss";
import { startTournamentGame } from "./startTournamentGame";
import { swissSetResultToPlayers } from "./swissSetResultToPlayers";

export async function finishTournamentGame({
  game,
  gameId,
  tournamentId,
  result,
}: {
  game: Game;
  gameId: string;
  tournamentId: string;
  result: Result;
}) {
  if (!game.round || !game.board) return;

  //   Устанавливаем результат матча и уменьшаем количество игр
  const [[currentActiveGames], status] = await Promise.all([
    decreaseTournamentActiveGameByOne(tournamentId),
    setTournamentMatchResult({
      tournamentId,
      round: game.round,
      board: game.board,
      result,
    }),
  ]);

  io.to(TOURNAMENT_ROOM(tournamentId)).emit("tournament:gameOver", {
    gameId,
    result,
    w: {
      id: game.white.username,
      rating: game.white.rating,
      title: game.white.title,
      res: transformResult(result, "b"),
    },
    b: {
      id: game.black.username,
      rating: game.black.rating,
      title: game.black.title,
      res: transformResult(result, "w"),
    },
  });

  // Получаем очки двух игроков
  const [scoreW, scoreB, [res]] = await Promise.all([
    getPlayerScore({
      tournamentId,
      username: game.white.username,
    }),
    getPlayerScore({
      tournamentId,
      username: game.black.username,
    }),
    getTournamentTV({ tournamentId, gameId }),
  ]);

  if (gameId == res && currentActiveGames != 0) {
    const games = await getTournamentActiveGames({
      tournamentId,
      round: game.round,
    });

    if (games.length) await setTournamentTV({ tournamentId, gameId: games[0] });
  }

  // if(res[0]==ga)

  //   Настраиваем правильно игроков перед жеребьевкой следующего раунда

  await swissSetResultToPlayers({
    tournamentId,
    white: {
      id: game.white.username,
      rating: game.white.rating,
      title: game.white.title,
      score: scoreW,
    },
    black: {
      id: game.black.username,
      rating: game.black.rating,
      title: game.black.title,
      score: scoreB,
    },
    result,
    gameId,
  });

  // const tv = await getTournamentTV(tournamentId)

  if (currentActiveGames == 0) {
    const [players] = await getAllPlayers({ tournamentId });
    const [round] = await increaseTournamentRound(tournamentId);
    const maxRound = await getTournamentMaxRound(tournamentId);
    if (round > maxRound[0]) {
      await calculateBuchholz({ tournamentId, players });
      const [matches] = (await getTournamentMatches({
        tournamentId,
      })) as MatchSwiss[];

      // TOURNAMENT ENDED
      await prisma.tournament.update({
        where: {
          id: tournamentId,
        },
        data: {
          status: "finished",
          // @ts-ignore
          players: Object.values(players),
          matches,
        },
      });

      io.emit("tournament:finish");
    } else {
      const activePlayers = await getActivePlayers({ tournamentId });

      const pairings = pairingSwiss(activePlayers, true);

      pairings.sort((a, b) => {
        if (!b[1] || !a[1]) return 0;
        const diff =
          Math.max(b[0].score, b[1]?.score) - Math.max(a[0].score, a[1]?.score);
        if (diff > 0) return 1;
        if (diff == 0) {
          const summa = b[0].score + b[0].score - a[0].score - a[1]?.score;
          if (summa > 0) {
            return 1;
          }
          if (summa < 0) {
            return -1;
          }
          return 0;
        }
        if (diff < 0) return -1;
        return 0;
      });

      for await (const [index, pair] of pairings.entries()) {
        const gameId = await startTournamentGame({
          pair,
          tournamentId,
          players,
          board: index + 1,
          control: game.control,
          round,
        });
        pair[3] = `${gameId}`;
      }

      if (pairings[0][3]) {
        await setTournamentTV({ tournamentId, gameId: pairings[0][3] });
      }

      // pairings.forEach(async (pair, index) => {
      //   await startTournamentGame({
      //     pair,
      //     tournamentId,
      //     players: players[0],
      //     board: index + 1,
      //     control: game.control,
      //     round: round[0],
      //   });
      // });
      await addTournamentMatch({
        tournamentId,
        matches: pairings,
      });

      io.to(TOURNAMENT_ROOM(tournamentId)).emit("tournament:pairings", {
        pairings,
      });

      await setTournamentActiveGames(
        tournamentId,
        activePlayers.length % 2 == 0 ? pairings.length : pairings.length - 1
      );
    }
  }
}
