import type { tab as tabType } from "$lib/types/home/tab";
import { writable, type Writable } from "svelte/store";

export const tab: Writable<tabType> = writable("challenge");
