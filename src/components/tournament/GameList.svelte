<script lang="ts">
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import { socket } from "$store/sockets/socket";
  import type { MatchSwiss } from "$types/tournament";
  import { onDestroy, onMount } from "svelte";

  export let gameList: MatchSwiss[] = [
    ["tayka", "philips", "*", 1.5, 2.5],
    ["tayka", "philips", "*", 1.5, 2.5],
  ];

  const fetchPairings = (round: number) => {
    return fetch(`/api/tournament/${$page.params.id}/pairings?round=${round}`);
  };

  onMount(async () => {
    const data = await fetchPairings(currentRound - 1);
    const pairings = await data.json();
    gameList = pairings[0];
    console.log("pairings", pairings);
  });

  export let rounds = 15;
  export let currentRound = 11;
  let selectedRound = 0;

  onMount(() => {
    $socket.on("tournament:pairings", ({ pairings }) => {
      // gameList[gameList.length - 1] = pairings;
      // gameList.push(pairings);
      gameList = pairings;
      // selectedRound = gameList.length - 1;
    });
  });

  beforeNavigate(() => {
    $socket.removeListener("tournament:pairings");
  });

  // onDestroy(() => {
  //   $socket.removeListener("tournament:pairings");
  // });
</script>

<div class=" flex justify-center space-x-1 ">
  {#each Array(rounds) as round, index}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={async () => {
        const data = await fetchPairings(index);
        const pairings = await data.json();
        gameList = pairings[0];
        selectedRound = index;
      }}
      class=" flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border bg-white shadow-lg {currentRound <=
      index
        ? 'bg-slate-100 text-slate-300'
        : ''} {selectedRound == index ? 'bg-green-100 text-green-700' : ''} "
    >
      {index + 1}
    </div>
  {/each}
  <!-- <div class="">2</div>
  <div class="">3</div>
  <div class="">4</div> -->
</div>

<div class="mt-10 overflow-hidden rounded-lg  border shadow-lg ">
  <!-- {#each gameList[showRound] as round, index} -->
  <!-- <div
    class=" rounded-tr-md rounded-tl-md  border-x border-t bg-white text-center text-sm"
  >
    <div class=" col-span-1 border-gray-300 px-4   py-2 text-gray-700">
      Тур {showRound + 1}
    </div>
  </div> -->

  {#each gameList as game, index}
    <div
      class="grid grid-cols-12   {index % 2
        ? 'bg-slate-50'
        : 'bg-white'} cursor-pointer text-center text-sm hover:bg-slate-100 "
    >
      <div
        class=" col-span-1 flex items-center justify-center border-r border-gray-300 font-medium text-gray-700"
      >
        {index + 1}
      </div>
      <div class=" col-span-5 flex border-gray-300   px-4 py-2 text-gray-700">
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
        {game[2] == "0.5-0.5" ? "=" : game[2]}
      </div>
      <div class=" col-span-5 flex border-gray-300   px-4 py-2 text-gray-700">
        <div class="">{game[4]}</div>
        <div class=" mx-auto">
          <BadgeTitle title="GM" />
          <span class=" font-medium text-slate-800">{game[1]}</span>
          <span class=" text-xs text-orange-700"> 2345</span>
        </div>
      </div>
    </div>
  {/each}
  <!-- {/each} -->

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
