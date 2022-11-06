import { writable, type Writable } from "svelte/store";
import type { getTournament } from "$types/home/tournament";

export const listOfTournaments: Writable<{
  count: number;
  tournaments: getTournament[] | null;
}> = writable({ count: 0, tournaments: null });
