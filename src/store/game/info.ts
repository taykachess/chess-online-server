import { writable, type Writable } from "svelte/store";

interface GameInfo {
  white: { username: string; rating: number };
  black: { username: string; rating: number };
  time: [number, number];
  result: string;
}
export const info: Writable<GameInfo> = writable();
