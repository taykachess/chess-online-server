<script lang="ts">
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import Podium from "$components/icons/Podium.svelte";
  import type { PlayerSwiss } from "$types/tournament";

  let winners: Pick<PlayerSwiss, "id" | "title" | "rating">[] = [
    { id: "taykafilready", title: "GM", rating: 2518 },
  ];
</script>

<div class="   ">
  <div class="relative grid h-full w-full grid-cols-3 grid-rows-3 gap-x-4 ">
    <div class=" col-span-1 row-span-2 row-start-2 flex flex-col  ">
      <div class="">Super</div>
      <div
        class="flex flex-1 items-center justify-center  bg-gradient-to-r from-gray-500 to-gray-700 font-serif text-6xl font-bold text-white"
      >
        2
      </div>
    </div>
    <div class=" col-span-1 row-span-3 row-start-1 flex flex-col  ">
      <div class="">Super</div>
      <div
        class=" flex flex-1 items-center justify-center  bg-gradient-to-r from-yellow-400 to-yellow-600 font-serif text-6xl font-bold text-white"
      >
        1
      </div>
    </div>
    <div class=" col-span-1 row-span-2 row-start-3 flex flex-col  ">
      <div class="">Super</div>
      <div
        class=" flex flex-1 items-center justify-center  bg-gradient-to-r from-orange-700 to-orange-900 font-serif text-6xl font-bold text-white"
      >
        3
      </div>
    </div>

    <!-- <Podium /> -->
    <!-- <div class=" absolute top-[30%] ">
      <div class=" ">
        <BadgeTitle title={winners[0].title} />
        <span class=" font-medium text-slate-800">{winners[0].id}</span>
      </div>
    </div> -->
  </div>
</div>
