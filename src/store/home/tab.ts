import { browser } from '$app/environment'
import { TAB_NAME_LOCAL_STORAGE } from '$lib/variables/home'
import type { Tab } from '$types/frontend'
import { writable, type Writable } from 'svelte/store'

export const tab: Writable<Tab> = writable()

if (browser) {
  const value = localStorage.getItem(TAB_NAME_LOCAL_STORAGE) as Tab
  if (value) tab.set(value)
  else tab.set('challenge')
}
