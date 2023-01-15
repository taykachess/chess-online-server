<script lang="ts">
  import type { Title } from "@prisma/client";
  import BadgeTitle from "./BadgeTitle.svelte";

  export let title: Title | null = "GM";
  export let username: string = "tayka";
  export let rating: number = 2022;
</script>

<div class=" flex items-baseline ">
  {#if title}
    <div class="">
      <BadgeTitle {title} />
    </div>
  {/if}
  <div class=" mx-1 text-base text-slate-700">{username}</div>

  <div class=" text-xs text-orange-700">{rating}</div>
</div>
