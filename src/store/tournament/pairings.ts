import { writable, type Writable } from "svelte/store";
import type { MatchSwiss } from "$types/tournament";
export const pairings: Writable<MatchSwiss[]> = writable();
