import { io } from "../../global/io";
import { setTourTV } from "../../global/tournament";
import { GetGame } from "../../types/game";
import { TOURNAMENT_ROOM } from "../../variables/redisIndex";
import { getGameForFrontend } from "../game/getGame";

export async function setTournamentTv(tournamentId: string, gameId: string) {
  await setTourTV({ tournamentId, gameId });
  const game = (await getGameForFrontend({ gameId })) as GetGame;
  if (game)
    io.to(TOURNAMENT_ROOM(tournamentId)).emit("tournament:tv", {
      game: { ...game, id: gameId },
    });
}
