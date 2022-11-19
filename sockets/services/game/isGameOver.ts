import { Chess } from "chess.js";

import type { Result } from "../../types/game";

export function isGameOver({ chess }: { chess: Chess }): Result {
  if (chess.isCheckmate()) {
    const turn = chess.turn();
    if (turn == "w") return "0-1";
    if (turn == "b") return "1-0";
  }
  if (chess.isDraw()) return "0.5-0.5";

  return "*";
}
