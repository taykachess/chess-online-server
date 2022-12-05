import { setPlayerCoefficientBuchholz } from "../../global/tournament";
import { PlayerSwiss } from "../../types/tournament";

export function calculateBuchholz({
  players,
  tournamentId,
}: {
  players: Record<string, PlayerSwiss>;
  tournamentId: string;
}) {
  const playersValues = Object.values(players);
  const queries: Promise<any>[] = [];
  playersValues.forEach((player) => {
    let buchholz = 0;
    player.avoid.forEach(
      (playerId) => (buchholz = buchholz + players[playerId].score)
    );
    // Для записи в db
    player.coefficient.buchholz = buchholz;

    queries.push(
      setPlayerCoefficientBuchholz({
        tournamentId,
        username: player.id,
        buchholz,
      })
    );
  });

  return Promise.all(queries);
}
