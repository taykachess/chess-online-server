<script lang="ts">
  import Tabs from "$components/home/Tabs.svelte";
  import TitleAndDescription from "$components/home/TitleAndDescription.svelte";
  import { tab } from "$store/home/tab";

  import Challenge from "$components/home/Challenge.svelte";
  import Tournament from "$components/home/Tournament.svelte";
  import Match from "$components/home/Match.svelte";
  import type { ActionData, PageData } from "./$types";

  export let data: PageData;
  export let form: ActionData;
</script>

<!-- px-4 sm:px-6 md:px-8 -->

<div class="mx-auto max-w-7xl ">
  <TitleAndDescription />

  <div class="mt-6">
    <Tabs />
  </div>
</div>

<div
  class="mt-10  flex flex-col items-center bg-gradient-to-br from-slate-700 to-slate-800  pb-6"
>
  {#if $tab === "challenge"}
    <Challenge />
  {:else if $tab === "match"}
    <Match />
  {:else if $tab === "tournament"}
    <Tournament />
  {:else if $tab === "puzzle"}
    <div class="" />
  {/if}
</div>
