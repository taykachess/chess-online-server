import { writable, type Writable } from "svelte/store";
import type { ChallengeFilters, GetChallenge } from "$types/challenge";
import { browser } from "$app/environment";

export const listOfChallenges: Writable<{
  count: number;
  challenges: GetChallenge[];
}> = writable({ count: 0, challenges: [] });

export const filters: Writable<ChallengeFilters> = writable();

if (browser) {
  setFilters();
}

function setFilters() {
  const storageFilters = localStorage.getItem("challengeFilters");
  if (!storageFilters) {
    const filters: ChallengeFilters = { rating: [-500, 500] };
    localStorage.setItem("challengeFilters", JSON.stringify(filters));
    return;
  }
  const parsedFilters = JSON.parse(storageFilters) as ChallengeFilters;
  if (storageFilters) filters.set(parsedFilters);
}

export const currentChallengeControl: Writable<string> = writable();
