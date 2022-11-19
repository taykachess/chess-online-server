import { writable, type Writable } from "svelte/store";
import type { GetTournament } from "$types/tournament";

export const listOfTournaments: Writable<{
  count: number;
  tournaments: GetTournament[] | null;
}> = writable({ count: 0, tournaments: null });
