<script lang="ts">
  import Pagination from '$components/common/Pagination.svelte'
  import ChessClockSvg from '$components/icons/ChessClockSVG.svelte'
  import IconCalendarDays from '$components/icons/IconCalendarDays.svelte'
  import type { GetChallenge } from '$types/challenge'

  export let challenges: GetChallenge[]
  //   export let currentPage = 1;
  //   export let count = 25;

  //   let onClickPagination = () => {};
</script>

<!-- prettier-ignore -->
<div class=" grid grid-cols-6 bg-slate-100 rounded-tr-md rounded-tl-md  w-full text-center text-sm border p-1">
    <div class=" col-span-2  py-1   border-gray-300 text-gray-900 font-bold"> Игрок </div>
    <div class=" col-span-2  py-1  border-gray-300 text-gray-900 font-bold"> Рейтинг </div>
    <div class=" col-span-2  py-1  border-gray-300 text-gray-900 font-bold"> Контроль </div>
  </div>

<!-- prettier-ignore -->
{#each challenges as challenge, index }
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div  class=" grid w-full grid-cols-6 border-x border-b {index%2?"bg-slate-50":" bg-white"} text-center text-sm font-medium hover:bg-sky-50 cursor-pointer  ">
    <div class=" col-span-2  py-2    border-gray-300 text-gray-700 truncate"> {challenge.user} </div>
    <div class=" col-span-2  py-2    border-gray-300 text-gray-700 truncate"> {challenge.rating} </div>
    <div class=" col-span-2  py-2    border-gray-300 text-gray-700 truncate"> {challenge.control} </div>
    
  </div>
{/each}

<!-- <div class=" mt-2" />
{#if count > 10}
  <Pagination {count} bind:currentPage cb={onClickPagination} title="Вызовов" />
{/if} -->
