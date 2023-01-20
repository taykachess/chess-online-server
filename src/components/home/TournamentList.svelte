<script lang="ts">
  import { goto } from '$app/navigation'
  import Badge from '$components/common/Badge.svelte'
  import BadgeTournamentFormat from '$components/common/BadgeTournamentFormat.svelte'
  import Pagination from '$components/common/Pagination.svelte'
  import IconChessClock from '$components/icons/IconChessClock.svelte'
  import IconCalendarDays from '$components/icons/IconCalendarDays.svelte'
  import { formatDate } from '$lib/utils/formatDate'
  import { time } from '$store/global/time'

  import type { TournamentTable } from '$types/tournament'

  export let count: number
  // Pick<TournamentTable, "name" | "format"|"_count"|''>
  export let tournaments: TournamentTable[] = [
    {
      name: 'Праздничный турнир в честь нового года',
      format: 'swiss',
      _count: { participants: 14 },
      // @ts-ignore
      startTime: new Date('21 December, 2022, 18:30').getTime(),
      id: 'whefjqfk',
      control: '3+2',
      playerLimit: 100,
      status: 'registration',
    },
    {
      name: 'Праздничный турнир в честь нового года',
      format: 'swiss',
      _count: { participants: 14 },
      // @ts-ignore
      startTime: new Date('21 December, 2022, 20:30').getTime(),
      id: 'whefjqfk',
      control: '3+2',
      playerLimit: 100,
      status: 'registration',
    },
  ]

  export let onClickPagination: (page: number) => void
  let currentPage = 1
</script>

<div class=" grid w-full grid-cols-8 rounded-tr-md rounded-tl-md  border bg-slate-100 p-1 text-center text-sm">
  <div class=" col-span-3  border-gray-300   py-2 font-bold text-gray-900">Турнир</div>
  <div class=" col-span-1  flex   justify-center border-gray-300 py-2 font-bold text-gray-900  ">
    <div class="h-6 w-6">
      <IconCalendarDays />
    </div>
  </div>
  <div class=" col-span-2  border-gray-300  py-2 font-bold text-gray-900">Тип</div>
  <div class=" col-span-1  flex  justify-center border-gray-300 py-1 font-bold text-gray-900  ">
    <div class="h-8 w-8">
      <IconChessClock />
    </div>
  </div>
  <div class=" col-span-1  border-gray-300  py-2 font-bold text-gray-900">Участники</div>
</div>

{#each tournaments as tournament, index}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    on:click={() => goto(`/tournament/${tournament.id}`)}
    class=" grid w-full grid-cols-8 border-x border-b {index % 2 ? 'bg-slate-50' : ' bg-white'} cursor-pointer text-center text-sm font-medium hover:bg-sky-50  "
  >
    <div class=" col-span-3  truncate    border-gray-300 py-2 text-gray-700">{tournament.name}</div>
    <div class=" col-span-1  flex    items-center justify-center  border-gray-300 py-2 text-gray-700 ">
      {formatDate(new Date(tournament.startTime).getTime(), $time, tournament.status)}
    </div>
    <div class=" col-span-2  border-gray-300   py-2 text-gray-700">
      <BadgeTournamentFormat format={tournament.format} />
      <Badge color={{ bg: ' bg-blue-100 ', text: ' p-px' }}>{tournament.rounds} туров</Badge>
    </div>
    <div class=" col-span-1  flex   items-center justify-center border-gray-300 py-2 text-gray-700">{tournament.control}</div>
    <div class=" col-span-1  border-gray-300  py-2 text-gray-700">{tournament._count.participants}/{tournament.playerLimit}</div>
  </div>
{/each}

<div class=" mt-2" />
{#if count > 10}
  <Pagination {count} bind:currentPage cb={onClickPagination} title="Турниров" />
{/if}
