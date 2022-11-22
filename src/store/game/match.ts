import { writable, type Writable } from "svelte/store";
import type { Match } from "$types/match";

export const match: Writable<Match | undefined> = writable();
