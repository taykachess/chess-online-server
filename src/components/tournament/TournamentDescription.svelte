<script lang="ts">
  import { page } from "$app/stores";
  import Badge from "$components/common/Badge.svelte";
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import { tournament } from "$store/tournament/tournament";

  import type { GetTournament } from "$types/tournament";

  import type { Title } from "$types/game";
  import { formatDate } from "$lib/utils/formatDate";
  export let tournamentInfo: {
    name: string;
    control: string;
    format: string;
    startDate: Date;
    description: string;
    orginizer: { title: Title | null; username: string };
  };

  async function Register() {
    await fetch(`/api/tournament/register/${$page.params.id}`, {
      method: "POST",
    });
  }
  async function CancelRegister() {
    await fetch(`/api/tournament/unregister/${$page.params.id}`, {
      method: "POST",
    });
  }

  $: isRegister = $tournament.participants?.some(
    (participant) => participant.username === $page.data.user?.username
  );
</script>

<!-- prettier-ignore -->
<div class="overflow-hidden bg-white shadow sm:rounded-lg border">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Турнирная информация</h3>
      <Badge title={`${tournamentInfo.control}`} color={{text:"text-slate-700 px-2", bg:"bg-slate-100"}}/>
      

      {#if !isRegister}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span on:click={Register} class="isolate inline-flex rounded-md shadow-sm shadow-slate-800 bg-white hover:bg-gray-50 ">
          <button  type="button" class="inline-flex items-center rounded-l border border-gray-300  px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
            Регистрация
          </button>  
          <button type="button" class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300  px-2.5 py-1.5 font-medium text-gray-700  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>    
          </button>
        </span>
        {:else}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span on:click={CancelRegister} class="isolate inline-flex rounded-md shadow-sm shadow-slate-800 bg-red-100 hover:bg-red-50 ">
          <button  type="button" class="inline-flex items-center rounded-l border border-gray-300  px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
            Отменить регистрацию
          </button>  
          <button type="button" class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300  px-2.5 py-1.5 font-medium text-gray-700  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>              
          </button>
        </span>
        {/if}

      <!-- <p class="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p> -->
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Название турнира</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{tournamentInfo.name}</dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Контроль</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <Badge title={`${tournamentInfo.control}`} color={{text:"text-slate-700 px-2", bg:"bg-slate-100"}}/>
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Формат</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <Badge title={`${tournamentInfo.format}`} color={{text:"text-green-800 px-2 py-1", bg:"bg-green-200"}}/>
          </dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Дата начала</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{formatDate(tournamentInfo.startDate, $tournament.status)}</dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Описание</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 max-h-40 overflow-y-scroll">{tournamentInfo.description}</dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Организатор</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            {#if tournamentInfo.orginizer.title}
            <BadgeTitle title={tournamentInfo.orginizer.title} /> 
            {/if}
         {tournamentInfo.orginizer.username}
        </dd>
        </div>
      </dl>
    </div>
  </div>
