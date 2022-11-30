<script lang="ts">
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import type { Title } from "$types/game";

  import type { Prisma } from "@prisma/client";
  export let players: {
    username: string;
    title?: Title | null;
    rating?: number;
    // seed: number;
  }[];

  console.log(players);
</script>

<div class=" shadow-lg">
  <!-- prettier-ignore -->
  <div class=" grid grid-cols-7 bg-white rounded-tr-md rounded-tl-md  w-full text-center text-sm border">
        <div class=" col-span-1 px-4 py-2   border-gray-300 text-gray-700"> 1/100 </div>
        <div class=" col-span-4 px-4 py-2  border-x  border-gray-300 text-gray-700"> Игроки </div>
        <div class=" col-span-2 px-4 py-2  border-gray-300 text-gray-700"> Рейтинг </div>
    </div>

  {#each players as player, index}
    <!-- prettier-ignore -->
    <div class=" grid grid-cols-7 bg-white border-b  border-x  w-full text-center">
          <div class="relative text-center col-span-1   border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{index+1}</div>
          <div class="relative col-span-4   border-x border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            {#if player.title}
              <BadgeTitle title={player.title} />
            {/if}  
              {player.username}
          </div>
          <div class="relative text-center col-span-2  rounded-r-md  border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{player.rating}</div>
        </div>
  {/each}
</div>
