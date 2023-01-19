<script lang="ts">
  import type { Title } from "@prisma/client";
  import BadgeTitle from "./BadgeTitle.svelte";

  export let title: Title | null = null;
  export let username: string = "";
  export let rating: number = 0;
</script>

<div class=" flex items-baseline font-medium ">
  {#if title}
    <div class="">
      <BadgeTitle {title} />
    </div>
  {/if}
  <div class=" mx-1 text-base text-slate-700">{username}</div>

  {#if rating}
    <div class=" text-xs text-orange-700">{rating}</div>
  {/if}
</div>
