import type { Tab } from "$types/frontend";
import { writable, type Writable } from "svelte/store";

export const tab: Writable<Tab> = writable("challenge");
