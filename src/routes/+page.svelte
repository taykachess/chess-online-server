<script lang="ts">
  import { tab } from '$store/home/tab'

  import Tabs from '$components/home/Tabs.svelte'
  import TitleAndDescription from '$components/home/TitleAndDescription.svelte'
  import Challenge from '$components/home/Challenge.svelte'
  import Tournament from '$components/home/Tournament.svelte'
  import { onDestroy } from 'svelte'
  import { currentChallengeControl } from '$store/home/challenges'
  import { currentMatchControl } from '$store/home/match'

  onDestroy(() => {
    $currentMatchControl = ''
    $currentChallengeControl = ''
  })
</script>

<div class="mx-auto max-w-6xl pt-20 ">
  <div class=" md:w-1/2">
    <TitleAndDescription />

    <div class="mt-6 ">
      <Tabs />
    </div>
  </div>
</div>

<div class="mt-10 flex  flex-col items-center bg-gradient-to-br from-slate-700 to-slate-800 px-4 pb-6  sm:px-0">
  <div class=" w-full md:max-w-6xl">
    {#if $tab === 'challenge'}
      <Challenge />
    {:else if $tab === 'tournament'}
      <div class=" mt-4">
        <Tournament />
      </div>
    {:else if $tab === 'puzzle'}
      <div class="" />
    {/if}
  </div>
</div>
