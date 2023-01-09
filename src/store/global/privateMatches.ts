import type { MatchCreateDtoExtended } from "$types/match";
import { writable, type Writable } from "svelte/store";

export const privateMatches: Writable<MatchCreateDtoExtended[]> = writable([]);
