import { writable, type Writable } from "svelte/store";

interface GameInfo {
  white: { username: string; rating: number; ratingNext?: number };
  black: { username: string; rating: number; ratingNext?: number };
  time: [number, number];
  result: string;
  pgn: string;
  requestId?: any;
}
export const info: Writable<GameInfo> = writable();
