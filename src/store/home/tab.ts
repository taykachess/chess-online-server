import type { Tab } from "$types/home/tab";
import { writable, type Writable } from "svelte/store";

export const tab: Writable<Tab> = writable("challenge");
