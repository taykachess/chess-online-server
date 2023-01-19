<script lang="ts">
  import Badge from "$components/common/Badge.svelte";
  import IconCheck from "$components/icons/IconCheck.svelte";
  import IconPawn from "$components/icons/IconPawn.svelte";
  import IconRook from "$components/icons/IconRook.svelte";
  import IconTrophy from "$components/icons/IconTrophy.svelte";
  import IconTv from "$components/icons/IconTv.svelte";
  import IconXCircle from "$components/icons/IconXCircle.svelte";
  import { formatTime } from "$lib/utils/formatTime";
  import { match } from "$store/game/match";
  import { time } from "$store/global/time";
  import type { TimePeriods } from "$types/match";

  export let periods: TimePeriods;
  export let stage: number;
  export let timestamp: Date;
  console.log(periods);
  $: timeToNextStage =
    new Date(timestamp).getTime() + periods[stage - 1][0] * 60 * 1000;
</script>

<div class=" mr-2 flex flex-col items-center justify-center ">
  <div class=" mb-2 text-xl font-bold text-slate-900  ">
    Матч
    {#if $match?.status == "finished"}
      завершен
    {/if}
  </div>
  {#if $match?.status == "running"}
    <div class="  text-slate-900  ">Этап {stage} из {periods.length}</div>
  {/if}

  <!-- <div class=" flex flex-col items-center justify-center "> -->
  {#each periods as period, index}
    <div
      class=" grid w-full grid-cols-7 divide-y border-r font-medium {periods.length -
        1 ==
      index
        ? ' border-b'
        : ''}  text-center  text-slate-800 "
    >
      <div class=" col-span-1 bg-slate-200  ">
        {index + 1}
      </div>
      <div class=" col-span-2">
        {period[1]}
      </div>
      <div class=" col-span-3">
        {period[0]} минут
      </div>
      <div class=" col-span-1 flex items-center justify-center ">
        {#if index < stage - 1 || $match.status == "finished"}
          <div class="h-5 w-5 text-green-700">
            <IconCheck />
          </div>
        {:else if index == stage - 1}
          <div class="h-5 w-5 ">
            <IconTv />
          </div>
        {:else}
          <div class="h-5 w-5 ">
            <IconXCircle />
          </div>
        {/if}
      </div>
      <!-- <div class=" col-span-3"></div> -->
      <!-- <Badge
          color={{
            text: index <= stage - 1 ? "  text-yellow-800" : "text-slate-400",
            bg: index <= stage - 1 ? "bg-yellow-200" : " bg-slate-200",
          }}>{index + 1}</Badge
        >
        <Badge
          color={{
            text: index <= stage - 1 ? "  text-yellow-800" : "text-slate-400",
            bg: index <= stage - 1 ? "bg-yellow-200" : " bg-slate-200",
          }}>{period[1]}</Badge
        >
        <Badge
          color={{
            text: index <= stage - 1 ? "  text-yellow-800" : "text-slate-400",
            bg: index <= stage - 1 ? "bg-yellow-200" : " bg-slate-200",
          }}>{period[0]} минут</Badge
        > -->
    </div>
  {/each}
  <!-- </div> -->

  {#if $match?.status == "running"}
    <div class=" mt-2 font-medium text-slate-800">До следующего этапа</div>
    <div class=" text-xl font-bold text-slate-800">
      {formatTime(timeToNextStage - $time)}
    </div>
  {/if}
</div>
