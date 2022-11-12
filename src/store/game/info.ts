import { writable, type Writable } from "svelte/store";

interface GameInfo {
  white: string;
  black: string;
  time: [number, number];
  status: string;
}
export const info: Writable<GameInfo> = writable();
