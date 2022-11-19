import type { ChallengeTab } from "$types/frontend";
import { writable, type Writable } from "svelte/store";

export const challengeTab: Writable<ChallengeTab> = writable("game");
