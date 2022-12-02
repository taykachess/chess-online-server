import type { Result } from "../types/game";

export function transformResult(result: Result, color: "w" | "b") {
  if (result == "1-0" || result == "+-") {
    if (color == "w") return 1;
    return 0;
  }
  if (result == "0-1" || result == "-+") {
    if (color == "w") return 0;
    return 1;
  }
  if (result == "0.5-0.5") {
    return 0.5;
  }
  return "*";
}
