import { writable, type Writable } from "svelte/store";
// import type { Match } from "$types/match";

export const isTournamentTimerVisible: Writable<boolean> = writable();

export const tournamentPrepareTime: Writable<number> = writable();
