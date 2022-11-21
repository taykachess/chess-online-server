import type { Match, MatchStatus } from "../../types/match";

export function getMatchStatus(match: Match): MatchStatus {
  const whiteScore = match.result[0] + match.result[2] * 0.5;
  const blackScore = match.result[1] + match.result[2] * 0.5;
  const scoresForDraw = match.rounds / 2;

  if (whiteScore > scoresForDraw || blackScore > scoresForDraw) {
    return "finished";
  }
  if (whiteScore == scoresForDraw && whiteScore == scoresForDraw) {
    if (match.armageddon) return "armageddon";
    else return "finished";
  }
  return "running";
}
