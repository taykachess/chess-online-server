import type { TournamentTab } from '$types/frontend'
import { writable, type Writable } from 'svelte/store'

export const tournamentTab: Writable<TournamentTab> = writable('all')
