import { writable, type Writable } from "svelte/store";

interface GameInfo {
  white: { username: string; rating: number; ratingNext?: number };
  black: { username: string; rating: number; ratingNext?: number };
  time: [number, number];
  result: "1-0" | "0.5-0.5" | "0-1" | "*" | "+-" | "-+";
  pgn: string;
  requestId?: any;
  inc: number;
  lastOfferDraw?: { username: string; ply: number };
  ply: number;
  role?: "w" | "b";
}
export const info: Writable<GameInfo> = writable();
