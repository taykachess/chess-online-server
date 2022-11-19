<script lang="ts">
  import { tab } from "$store/home/tab";

  import Tabs from "$components/home/Tabs.svelte";
  import TitleAndDescription from "$components/home/TitleAndDescription.svelte";
  import Challenge from "$components/home/Challenge.svelte";
  import Tournament from "$components/home/Tournament.svelte";
  import Match from "$components/home/Match.svelte";
</script>

<div class="mx-auto max-w-7xl pt-20 ">
  <TitleAndDescription />

  <div class="mt-6 flex justify-center">
    <Tabs />
  </div>
</div>

<div
  class="mt-10 flex  flex-col items-center bg-gradient-to-br from-slate-700 to-slate-800 px-4 pb-6  sm:px-0"
>
  <div class=" w-full md:max-w-6xl">
    {#if $tab === "challenge"}
      <Challenge />
    {:else if $tab === "match"}
      <Match />
    {:else if $tab === "tournament"}
      <div class=" mt-4">
        <Tournament />
      </div>
    {:else if $tab === "puzzle"}
      <div class="" />
    {/if}
  </div>
</div>
