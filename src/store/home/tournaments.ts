import { writable, type Writable } from "svelte/store";
import type { TournamentTable } from "$types/tournament";

export const listOfTournaments: Writable<{
  count: number;
  tournaments: TournamentTable[] | null;
}> = writable({ count: 0, tournaments: null });
