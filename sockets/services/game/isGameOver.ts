import { Chess } from "chess.js";
import type { Result } from "../../global/games";
export function isGameOver({
  chess,
  turn,
}: {
  chess: Chess;
  turn: "w" | "b";
}): Result {
  if (chess.isCheckmate()) {
    if (turn == "w") return "0-1";
    if (turn == "b") return "1-0";
  }
  if (chess.isDraw()) return "0.5-0.5";

  return "*";
}
