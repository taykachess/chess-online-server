import { Result } from "../../types/game";
import { PlayerSwiss } from "../../types/tournament";

export function swissSetResultToPlayer({
  white,
  black,
  result,
  gameId,
}: {
  white: PlayerSwiss;
  black: PlayerSwiss;
  result: Result;
  gameId: string;
}) {
  // Increase white player color
  white.colors = white.colors + 1;

  // Avoid to play each other in the next round
  white.avoid?.push(black.id);
  black.avoid?.push(white.id);

  // after the game set to false and then once again check
  white.pairedUpDown = false;
  black.pairedUpDown = false;

  if (white.score > black.score) {
    white.pairedUpDown = true;
    black.pairedUpDown = true;
  }

  white.matches?.push(gameId);
  black.matches?.push(gameId);

  if (result == "1-0" || result == "+-") {
    white.score = white.score + 1;
  } else if (result == "0-1" || result == "-+") {
    black.score = black.score + 1;
  } else if (result == "0.5-0.5") {
    white.score = white.score + 0.5;
    black.score = black.score + 0.5;
  }
}
