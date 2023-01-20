<script lang="ts">
  import Pagination from '$components/common/Pagination.svelte'
  import ChessClockSvg from '$components/icons/IconChessClock.svelte'
  import IconCalendarDays from '$components/icons/IconCalendarDays.svelte'
  import type { GetChallenge } from '$types/challenge'

  export let challenges: GetChallenge[]
  //   export let currentPage = 1;
  //   export let count = 25;

  //   let onClickPagination = () => {};
</script>

<div class=" grid w-full grid-cols-6 rounded-tr-md rounded-tl-md  border bg-slate-100 p-1 text-center text-sm">
  <div class=" col-span-2  border-gray-300   py-1 font-bold text-gray-900">Игрок</div>
  <div class=" col-span-2  border-gray-300  py-1 font-bold text-gray-900">Рейтинг</div>
  <div class=" col-span-2  border-gray-300  py-1 font-bold text-gray-900">Контроль</div>
</div>

{#each challenges as challenge, index}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class=" grid w-full grid-cols-6 border-x border-b {index % 2 ? 'bg-slate-50' : ' bg-white'} cursor-pointer text-center text-sm font-medium hover:bg-sky-50  ">
    <div class=" col-span-2  truncate    border-gray-300 py-2 text-gray-700">{challenge.user}</div>
    <div class=" col-span-2  truncate    border-gray-300 py-2 text-gray-700">{challenge.rating}</div>
    <div class=" col-span-2  truncate    border-gray-300 py-2 text-gray-700">{challenge.control}</div>
  </div>
{/each}

<!-- <div class=" mt-2" />
{#if count > 10}
  <Pagination {count} bind:currentPage cb={onClickPagination} title="Вызовов" />
{/if} -->
