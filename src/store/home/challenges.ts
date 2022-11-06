import { writable, type Writable } from "svelte/store";
import type { GetChallenge } from "$types/home/Challenge";

export const listOfChallenges: Writable<{
  count: number;
  challenges: GetChallenge[] | null;
}> = writable({ count: 0, challenges: null });
