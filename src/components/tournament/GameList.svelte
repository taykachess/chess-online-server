<script lang="ts">
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import type { MatchSwiss } from "$types/tournament";

  const gameList: MatchSwiss[][] = [[["tayka", "philips", "*", 1.5, 2.5]]];
</script>

<div class="shadow-lg ">
  {#each gameList as round, index}
    <div
      class=" rounded-tr-md rounded-tl-md  border-x border-t bg-white text-center text-sm"
    >
      <div class=" col-span-1 border-gray-300 px-4   py-2 text-gray-700">
        Тур {index + 1}
      </div>
    </div>

    {#each round as game}
      <div class="grid grid-cols-9   border bg-white text-center text-sm">
        <div class=" col-span-4 flex border-gray-300   px-4 py-2 text-gray-700">
          <div class=" mx-auto">
            <BadgeTitle title="GM" />
            <span class=" font-medium text-slate-800">{game[0]}</span>
            <span class=" text-xs text-orange-700"> 2345</span>
          </div>
          <div class=" ml-auto">{game[3]}</div>
        </div>
        <div
          class=" col-span-1 flex items-center justify-center border-x border-gray-300 font-medium text-gray-700"
        >
          {game[2]}
        </div>
        <div class=" col-span-4 flex border-gray-300   px-4 py-2 text-gray-700">
          <div class="">{game[4]}</div>
          <div class=" mx-auto">
            <BadgeTitle title="GM" />
            <span class=" font-medium text-slate-800">{game[1]}</span>
            <span class=" text-xs text-orange-700"> 2345</span>
          </div>
        </div>
      </div>
    {/each}
  {/each}

  <!-- <div class=" col-span-3 border-t border-gray-300 px-4   py-2 text-gray-700">
      <BadgeTitle title="GM" />
      <span class=" font-medium text-slate-800">Tayka</span>
      <span class=" text-xs text-orange-700"> 2345</span>
    </div>
    <div
      class=" col-span-1 border-x border-t border-gray-300  px-4  py-2 text-gray-700"
    >
      1-0
    </div>
    <div class=" col-span-3 border-t border-gray-300 px-4  py-2 text-gray-700">
      <BadgeTitle title="IM" />
      <span class=" font-medium text-slate-800">Kirpish2019</span>
      <span class=" text-xs text-orange-700"> 2456</span>
    </div> -->
  <!-- <div class="flex items-center justify-between px-4 py-5 sm:px-6">sdf</div> -->
</div>
