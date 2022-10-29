<script lang="ts">
  import ChallengeTable from "$components/home/ChallengeTable.svelte";
  import GameSender from "$components/home/GameSender.svelte";
  import Tabs from "$components/home/Tabs.svelte";
  import TitleAndDescription from "$components/home/TitleAndDescription.svelte";
  import { tab } from "$store/home/tab";

  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
  <TitleAndDescription />

  <div class="mt-6">
    <Tabs />
  </div>
</div>

<div class="  mt-10 bg-gradient-to-br from-slate-700 to-slate-800  p-8">
  <div class="  mx-auto grid max-w-7xl grid-cols-2  px-4 sm:px-6 md:px-8 ">
    {#if $tab === "challenge"}
      <GameSender />
      <ChallengeTable />
    {/if}
  </div>
</div>
