import { writable, type Writable } from 'svelte/store'

export const gamesInProgress: Writable<string[]> = writable([])
