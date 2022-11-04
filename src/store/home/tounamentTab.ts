import type { TournamentTab } from "$types/home/tab";
import { writable, type Writable } from "svelte/store";

export const tournamentTab: Writable<TournamentTab> = writable("all");
