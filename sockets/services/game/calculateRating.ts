import type { Result } from "../../global/games";

export function calculateRating({
  eloWhite,
  eloBlack,
  result,
  control,
}: {
  eloWhite: number;
  eloBlack: number;
  result: Result;
  control: string;
}): { newEloWhite: number; newEloBlack: number } {
  let actualPointWhite: number;
  let actualPointBlack: number;
  const K = calculateK(control);

  switch (result) {
    case "1-0":
      actualPointWhite = 1;
      actualPointBlack = 0;
      break;
    case "0.5-0.5":
      actualPointWhite = 0.5;
      actualPointBlack = 0.5;
      break;
    case "0-1":
      actualPointWhite = 0;
      actualPointBlack = 1;
      break;
    default:
      throw Error("Game not over yet");
  }

  const expectedPointWhite = 1 / (1 + 10 ** ((eloBlack - eloWhite) / 400));
  const expectedPointBlack = 1 / (1 + 10 ** ((eloWhite - eloBlack) / 400));
  const newEloWhite = +eloWhite + K * (actualPointWhite - expectedPointWhite);
  const newEloBlack = +eloBlack + K * (actualPointBlack - expectedPointBlack);

  return { newEloWhite, newEloBlack };
}

function calculateK(control: string): number {
  const time = +control.split("+")[0];
  const increment = +control.split("+")[1];

  if (time <= 1) {
    return increment == 0 ? 1 : 2;
  } else if (time <= 3) {
    return increment == 0 ? 3 : increment == 1 ? 4 : 5;
  } else return 10;
}
