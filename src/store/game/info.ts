import { writable, type Writable } from "svelte/store";
import type { GameInfo } from "$types/game";

export const info: Writable<GameInfo> = writable();
