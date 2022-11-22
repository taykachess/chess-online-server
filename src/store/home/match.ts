import { writable, type Writable } from "svelte/store";
import type { MatchFilters, GetMatch } from "$types/match";
import { browser } from "$app/environment";

export const listOfMatches: Writable<{
  count: number;
  matches: GetMatch[];
}> = writable({ count: 0, matches: [] });

export const filters: Writable<MatchFilters> = writable();

if (browser) {
  setFilters();
}

function setFilters() {
  const storageFilters = localStorage.getItem("matchFilters");
  if (!storageFilters) {
    const filters: MatchFilters = { rating: [-500, 500] };
    localStorage.setItem("challengeFilters", JSON.stringify(filters));
    return;
  }
  const parsedFilters = JSON.parse(storageFilters) as MatchFilters;
  if (storageFilters) filters.set(parsedFilters);
}

export const currentMatchControl: Writable<string> = writable();
