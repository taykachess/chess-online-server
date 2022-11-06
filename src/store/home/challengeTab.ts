import type { ChallengeTab } from "$types/home/tab";
import { writable, type Writable } from "svelte/store";

export const challengeTab: Writable<ChallengeTab> = writable("game");
