<script lang="ts">
  import { goto } from "$app/navigation";
  import Badge from "$components/common/Badge.svelte";
  import BadgeTournamentFormat from "$components/common/badgeTournamentFormat.svelte";
  import Pagination from "$components/common/Pagination.svelte";
  import ChessClockSvg from "$components/icons/ChessClockSVG.svelte";
  import { formatDate } from "$lib/utils/formatDate";
  import { time } from "$store/global/time";
  import type { GetTournament, TournamentTable } from "$types/tournament";

  export let count: number;
  // Pick<TournamentTable, "name" | "format"|"_count"|''>
  export let tournaments: TournamentTable[] = [
    {
      name: "Праздничный турнир в честь нового года",
      format: "swiss",
      _count: { participants: 14 },
      // @ts-ignore
      startTime: new Date("21 December, 2022, 18:30").getTime(),
      id: "whefjqfk",
      control: "3+2",
      playerLimit: 100,
      status: "registration",
    },
    {
      name: "Праздничный турнир в честь нового года",
      format: "swiss",
      _count: { participants: 14 },
      // @ts-ignore
      startTime: new Date("21 December, 2022, 20:30").getTime(),
      id: "whefjqfk",
      control: "3+2",
      playerLimit: 100,
      status: "registration",
    },
  ];

  export let onClickPagination: (page: number) => void;
  let currentPage = 1;
</script>

<!-- prettier-ignore -->
<div class=" grid grid-cols-8 bg-slate-100 rounded-tr-md rounded-tl-md  w-full text-center text-sm border p-1">
  <div class=" col-span-3  py-2   border-gray-300 text-gray-900 font-bold"> Турнир </div>
  <div class=" col-span-1  py-2   border-gray-300 text-gray-900 font-bold"> Дата </div>
  <div class=" col-span-2  py-2  border-gray-300 text-gray-900 font-bold"> Тип </div>
  <div class=" col-span-1  py-2  border-gray-300 text-gray-900 font-bold"> Контроль </div>
  <div class=" col-span-1  py-2  border-gray-300 text-gray-900 font-bold"> Участники </div>
</div>

<!-- prettier-ignore -->
{#each tournaments as tournament, index }
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click={()=>goto(`/${tournament.format}/${tournament.id}`)} class=" grid w-full grid-cols-8 border-x border-b {index%2?"bg-slate-50":" bg-white"} text-center text-sm font-medium hover:bg-sky-50 cursor-pointer  ">
    <div class=" col-span-3  py-2    border-gray-300 text-gray-700 truncate"> {tournament.name} </div>
    <div class=" col-span-1  py-2    border-gray-300 text-gray-700"> 
      {
        formatDate(
          new Date(tournament.startTime).getTime(),
          $time,
          tournament.status
        )
      } 
    </div>
    <div class=" col-span-2  py-2   border-gray-300 text-gray-700"> <BadgeTournamentFormat format={tournament.format}   /> <Badge title={`${tournament.rounds} туров`} color={{bg:" bg-blue-100 ", text:" p-px"}}></Badge> </div>
    <div class=" col-span-1  py-2   border-gray-300 text-gray-700"> {tournament.control}</div>
    <div class=" col-span-1  py-2  border-gray-300 text-gray-700"> {tournament._count.participants}/{tournament.playerLimit}</div>
  </div>
{/each}

<div class=" mt-2" />
{#if count > 10}
  <Pagination
    {count}
    bind:currentPage
    cb={onClickPagination}
    title="Турниров"
    textClass="text-slate-300"
  />
{/if}
