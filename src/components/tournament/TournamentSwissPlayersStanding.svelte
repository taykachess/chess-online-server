<script lang="ts">
  import BadgeTitle from "$components/common/BadgeTitle.svelte";

  import type { Title } from "$types/game";
  export let players: {
    username: string;
    title?: Title;
    rating: number;
    place: string;
    points: number;
    buchholz: number;
  }[] = [
    {
      username: "tayka",
      title: "GM",
      rating: 2710,
      place: "1-3",
      points: 7.5,
      buchholz: 67.5,
    },
    {
      username: "sanitazer",
      title: "GM",
      rating: 2620,
      place: "1-3",
      points: 7.5,
      buchholz: 67.5,
    },
  ];
</script>

<div class=" shadow-lg">
  <!-- prettier-ignore -->
  <div class=" grid grid-cols-7 bg-white rounded-tr-md rounded-tl-md  w-full text-center text-sm border">
          <div class=" col-span-1  py-2  border-r  border-gray-300 text-gray-700"> Место </div>
          <div class=" col-span-4  py-2  border-r  border-gray-300 text-gray-700"> Игроки </div>
          <div class=" col-span-1  py-2 border-r  border-gray-300 text-gray-700"> Очки </div>
          <div class=" col-span-1  py-2  border-gray-300 text-gray-700"> Бухгольц </div>

      </div>

  {#each players as player}
    <!-- prettier-ignore -->
    <div class=" grid grid-cols-7 bg-white border-b  border-x  w-full text-center">
              <div class="relative text-center border-r col-span-1   border-gray-300  py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{player.place}</div>
              <div class="relative col-span-4   border-r border-gray-300  py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                {#if player.title}
                  <BadgeTitle title={player.title} />
                {/if}  
                  {player.username}  <span class=" text-xs text-orange-700"> {player.rating}</span>
                  <!-- <Badge title="2700" color={{text:" text-slate-100 ", bg:" bg-slate-800"}} /> -->
              </div>
              <div class="relative text-center col-span-1 border-r border-gray-300  py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{player.points}</div>
              <div class="relative text-center col-span-1  border-gray-300  py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{player.buchholz}</div>
            </div>
  {/each}
</div>
