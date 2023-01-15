<script lang="ts">
  import Badge from "$components/common/Badge.svelte";
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import PlayerComponent from "$components/common/PlayerComponent.svelte";

  import type { Player } from "$types/game";
  export let player: Player;

  $: difference = player.ratingNext ? player.ratingNext - player.rating : 0;
</script>

<div class="flex items-baseline text-xs font-medium text-slate-800 ">
  <PlayerComponent
    title={player.title}
    username={player.username}
    rating={player.rating}
  />
  <!-- {#if player.title}
    <div class="">
      <BadgeTitle title={player.title} />
    </div>
  {/if}
  <div class=" ml-1 text-base">{player.username}</div>
  <div class="relative ml-3 ">
    <Badge
      title={`${Math.trunc(player.rating)}`}
      color={{ text: "text-slate-100", bg: "bg-slate-800" }}
    />
    {#if player.ratingNext}
      <div class=" absolute -top-3 right-4 h-10 w-1 rotate-45 bg-red-500/80" />
    {/if}
  </div> -->
  {#if player.ratingNext}
    <div class=" mx-px">→</div>
    <div class=" ">
      <Badge
        title={`${Math.trunc(player.ratingNext)}`}
        color={difference > 0
          ? { text: "text-green-100", bg: "bg-green-800" }
          : { text: "text-pink-100", bg: "bg-pink-800" }}
      />
    </div>
  {/if}
  <!-- <p class="text-indigo-400">Vadim Moiseenko</p> -->
</div>
