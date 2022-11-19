import { writable, type Writable } from "svelte/store";
import type { GetChallenge } from "$types/challenge";

export const listOfChallenges: Writable<{
  count: number;
  challenges: GetChallenge[];
}> = writable({ count: 0, challenges: [] });
