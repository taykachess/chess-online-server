<script lang="ts">
  import { page } from '$app/stores'
  import Badge from '$components/common/Badge.svelte'
  import ChallengeFiltersComponent from '$components/dialogs/Filters/ChallengeFilters.svelte'
  import { me } from '$store/global/me'
  import { filters } from '$store/home/challenges'
  import type { ChallengeFilters, GetChallenge } from '$types/challenge'

  let isOpen = false

  function summa(filters: ChallengeFilters) {
    let sum = 0
    if (!filters) return ``
    if (filters.rating[0] != -500 || filters.rating[1] != 500) sum++

    return `${sum}`
  }

  // $: activeFilters = summa($filters);
</script>

<div class=" hidden">
  <ChallengeFiltersComponent bind:isOpen />
</div>

<button
  on:click={() => {
    if (!$me) return
    isOpen = true
  }}
  type="button"
  class="relative rounded-md  bg-white px-2"
>
  <svg class="h-5 w-5  rounded-md  text-slate-700 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
    /></svg
  >
  <!-- <span class="  ml-1">
    <Badge
      title={activeFilters}
      color={{ text: "text-white", bg: "bg-slate-700" }}
    />
  </span> -->
</button>
