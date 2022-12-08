import { writable, type Writable } from "svelte/store";

export const clock: Writable<[number, number]> = writable();
