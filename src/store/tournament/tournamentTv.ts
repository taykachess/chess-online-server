import { writable, type Writable } from "svelte/store";
import type { TournamentTv } from "$types/tournament";
import type { ChessBoardInstance } from "cm-chessboard-ts";
import { Chess, type ChessInstance } from "cm-chess-ts";
export const tournamentTv: Writable<TournamentTv> = writable();

export const selectedTournamentGameId: Writable<string> = writable();
export const liveTournamentGameId: Writable<string> = writable();

export const requestId: Writable<any> = writable();
export const intervalId: Writable<any> = writable();

export const tournamentPrepareTime: Writable<number> = writable();
export const isTournamentTimerVisible: Writable<boolean> = writable();

export const board: Writable<ChessBoardInstance> = writable();
export const chess: Writable<ChessInstance> = writable(new Chess());
