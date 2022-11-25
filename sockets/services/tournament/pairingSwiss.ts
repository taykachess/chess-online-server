import blossom from "edmonds-blossom";

import type { PlayerSwiss, MatchSwiss } from "../../types/tournament";

export function shuffle(arr: (string | number)[]): (string | number)[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const z = Math.floor(Math.random() * (i + 1));
    [a[i], a[z]] = [a[z], a[i]];
  }
  return a;
}
// export interface Match {
//   round: number;
//   match: number;
//   player1: Player;
//   player2: Player;
//   win?: {
//     round: number;
//     match: number;
//   };
//   loss?: {
//     round: number;
//     match: number;
//   };
// }
// interface Player {
//   id: string;
//   score: number;
//   colors: number;
//   pairedUpDown?: boolean;
//   receivedBye?: boolean;
//   avoid?: (string | number)[];
//   rating: number;
// }

interface PlayerSwissIndex extends PlayerSwiss {
  index?: number;
}

export function Swiss(
  players: PlayerSwissIndex[],
  round: number,
  rated = false
): MatchSwiss[] {
  const matches: MatchSwiss[] = [];
  const playerArray: PlayerSwissIndex[] = players;

  //   if (rated) {
  //       playerArray.filter(p => !p.hasOwnProperty('rating') || p.rating === null).forEach(p => p.rating = 0);
  //   }

  //   console.log(players);

  playerArray.sort((a, b) => b.rating - a.rating);

  playerArray.forEach((p, i) => (p.index = i));
  const scoreGroups = [...new Set(playerArray.map((p) => p.score))].sort(
    (a, b) => a - b
  );
  const scoreSums = [
    ...new Set(
      scoreGroups
        .map((s, i, a) => {
          const sums = [];
          for (let j = i; j < a.length; j++) {
            sums.push(s + a[j]);
          }
          return sums;
        })
        .flat()
    ),
  ].sort((a, b) => a - b);
  const pairs = [];
  for (let i = 0; i < playerArray.length; i++) {
    const curr = playerArray[i];
    const next = playerArray.slice(i + 1);
    const sorted = rated
      ? [...next].sort(
          (a, b) =>
            Math.abs(curr.rating - a.rating) - Math.abs(curr.rating - b.rating)
        )
      : [];
    for (let j = 0; j < next.length; j++) {
      const opp = next[j];
      if (curr.avoid && curr.avoid.includes(opp.id)) {
        continue;
      }
      let wt =
        12 *
        Math.log10(
          scoreSums.findIndex((s) => s === curr.score + opp.score) + 1
        );
      const scoreGroupDiff = Math.abs(
        scoreGroups.findIndex((s) => s === curr.score) -
          scoreGroups.findIndex((s) => s === opp.score)
      );
      wt +=
        scoreGroupDiff < 2
          ? 5 / (2 * Math.log10(scoreGroupDiff + 2))
          : 1 / Math.log10(scoreGroupDiff + 2);

      wt += Math.abs(curr.colors - opp.colors);
      if (scoreGroupDiff === 1 && curr.pairedUpDown && opp.pairedUpDown) {
        wt += 1.1;
      }
      if (rated) {
        // EDITED from - to +
        wt +=
          (1 / 3) *
          (Math.log2(sorted.length) +
            Math.log2(sorted.findIndex((p) => p.id === opp.id) + 1));
        // console.log(sorted);
        // console.log(wt, sorted.findIndex((p) => p.id === opp.id) + 1);
      }
      if (
        (curr.receivedBye && curr.receivedBye) ||
        (opp.receivedBye && opp.receivedBye)
      ) {
        wt *= 1.25;
      }
      pairs.push([curr.index, opp.index, wt]);
    }
  }
  //   console.log(pairs);
  //   @ts-ignore
  const blossomPairs = blossom(pairs, true);
  const playerCopy = [...playerArray];
  let byeArray = [];
  let match = 1;
  do {
    const indexA = playerCopy[0].index;
    // @ts-ignore
    const indexB = blossomPairs[indexA];
    if (indexB === -1) {
      byeArray.push(playerCopy.splice(0, 1)[0]);
      continue;
    }
    playerCopy.splice(0, 1);
    playerCopy.splice(
      playerCopy.findIndex((p) => p.index === indexB),
      1
    );
    //   @ts-ignore
    let one = playerArray.find((p) => p.index === indexA);
    //   @ts-ignore
    let two = playerArray.find((p) => p.index === indexB);
    if (!one || !two) break;
    one = {
      id: one?.id,
      score: one?.score,
      rating: one?.rating,
      colors: one?.colors,
    };
    two = {
      id: two?.id,
      score: two?.score,
      rating: two?.rating,
      colors: two?.colors,
    };
    matches.push({
      round: round,
      match: match++,
      //   @ts-ignore
      player1: one?.colors < two?.colors ? one : two,
      //   @ts-ignore
      player2: one?.colors < two?.colors ? two : one,
    });
  } while (
    playerCopy.length >
    blossomPairs.reduce(
      (sum: number, idx: number) => (idx === -1 ? sum + 1 : sum),
      0
    )
  );
  byeArray = [...byeArray, ...playerCopy];
  for (let i = 0; i < byeArray.length; i++) {
    matches.push({
      round: round,
      match: match++,
      player1: byeArray[i],
      player2: null,
    });
  }
  //   @ts-ignore
  return matches;
}