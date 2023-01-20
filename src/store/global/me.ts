import type { DecodedUser } from '$types/user'
import { writable, type Writable } from 'svelte/store'

export const me: Writable<DecodedUser | undefined> = writable()
