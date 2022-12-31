import { writable, type Writable } from "svelte/store";
import type { ChallengeFilters, GetChallenge } from "$types/challenge";
import { browser } from "$app/environment";
import { CHALLENGE_FILTERS_LOCAL_STORAGE } from "$lib/variables/home";

export const listOfChallenges: Writable<{
  count: number;
  challenges: GetChallenge[];
}> = writable({ count: 0, challenges: [] });

export const filters: Writable<ChallengeFilters> = writable();

if (browser) {
  setFilters();
}

function setFilters() {
  const storageFilters = localStorage.getItem(CHALLENGE_FILTERS_LOCAL_STORAGE);

  console.log("filters", storageFilters);
  if (!storageFilters) {
    const filters: ChallengeFilters = { rating: [-500, 500], control: "3+0" };
    localStorage.setItem(
      CHALLENGE_FILTERS_LOCAL_STORAGE,
      JSON.stringify(filters)
    );
    return;
  }

  const parsedFilters = JSON.parse(storageFilters) as ChallengeFilters;
  if (!parsedFilters.control) {
    parsedFilters.control = "3+0";
  }
  if (storageFilters) filters.set(parsedFilters);
}

export const currentChallengeControl: Writable<string> = writable();
