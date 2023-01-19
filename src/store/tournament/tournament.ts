import { writable, type Writable } from 'svelte/store'
import type { GetTournament } from '$types/tournament'
export const tournament: Writable<GetTournament> = writable()
