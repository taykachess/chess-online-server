import { writable, type Writable } from "svelte/store";
import type { TournamentTv } from "$types/tournament";
export const tournamentTv: Writable<TournamentTv> = writable();
