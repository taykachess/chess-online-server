import { writable, type Writable } from "svelte/store";
import type { ChessBoardInstance } from "cm-chessboard-ts";
export const board: Writable<ChessBoardInstance> = writable();
