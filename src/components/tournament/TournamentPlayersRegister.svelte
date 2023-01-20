<script lang="ts">
  import BadgeTitle from '$components/common/BadgeTitle.svelte'
  import type { Title } from '$types/game'

  export let players: {
    username: string
    title?: Title | null
    rating?: number
  }[]
</script>

<div class=" ">
  <div class="shadow-lg">
    <div class=" grid w-full grid-cols-7 rounded-tr-md rounded-tl-md  border bg-white text-center text-sm">
      <div class=" col-span-1 border-gray-300 px-4   py-2 text-gray-700">1/100</div>
      <div class=" col-span-4 border-x border-gray-300  px-4  py-2 text-gray-700">Игроки</div>
      <div class=" col-span-2 border-gray-300 px-4  py-2 text-gray-700">Рейтинг</div>
    </div>

    {#each players as player, index}
      <div class=" grid w-full grid-cols-7 border-x  border-b  bg-white text-center">
        <div class="relative col-span-1 border-gray-300   px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50">{index + 1}</div>
        <div class="relative col-span-4   border-x border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          {#if player.title}
            <BadgeTitle title={player.title} />
          {/if}
          {player.username}
        </div>
        <div class="relative col-span-2 rounded-r-md  border-gray-300  px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50">{player.rating}</div>
      </div>
    {/each}
  </div>
</div>
