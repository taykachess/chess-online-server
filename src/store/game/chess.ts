import { writable, type Writable } from "svelte/store";
import type { ChessInstance } from "cm-chess";

export const chess: Writable<ChessInstance> = writable();
