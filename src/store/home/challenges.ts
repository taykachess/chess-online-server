import { writable, type Writable } from "svelte/store";
import type { Filters, GetChallenge } from "$types/challenge";
import { browser } from "$app/environment";

export const listOfChallenges: Writable<{
  count: number;
  challenges: GetChallenge[];
}> = writable({ count: 0, challenges: [] });

export const filters: Writable<Filters> = writable();

if (browser) {
  setFilters();
}

function setFilters() {
  const storageFilters = localStorage.getItem("challengeFilters");
  if (!storageFilters) {
    const filters: Filters = { rating: [-500, 500] };
    localStorage.setItem("challengeFilters", JSON.stringify(filters));
    return;
  }
  const parsedFilters = JSON.parse(storageFilters) as Filters;
  if (storageFilters) filters.set(parsedFilters);
}
