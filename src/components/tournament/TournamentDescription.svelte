<script lang="ts">
  import { page } from "$app/stores";
  import Badge from "$components/common/Badge.svelte";
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import { tournament } from "$store/tournament/tournament";

  import type { GetTournament } from "$types/tournament";

  import type { Title } from "$types/game";
  import { formatDate } from "$lib/utils/formatDate";
  import { time } from "$store/global/time";
  import ButtonRegister from "./ButtonRegister.svelte";
  import ButtonCancel from "./ButtonCancel.svelte";
  import ButtonReadyToPlay from "./ButtonReadyToPlay.svelte";
  import ButtonStop from "./ButtonStop.svelte";
  export let tournamentInfo: {
    name: string;
    control: string;
    format: "swiss";
    startDate: Date;
    description: string;
    orginizer: { title: Title | null; username: string };
    rounds: number;
  };

  $: isRegister = $tournament.participants?.some(
    (participant) => participant.username === $page.data.user?.username
  );

  $: isActive = $tournament.players?.some(
    (player) => player.id === $page.data.user?.username && player.active
  );

  function transformTournamentFormat(format: "swiss", rounds?: number): string {
    if (format == "swiss") return `Щвейцарская система`;
    return "Турнир";
  }
</script>

<!-- prettier-ignore -->
<div class="overflow-hidden bg-white shadow sm:rounded-lg border">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Турнирная информация</h3>

      {#if $page.data.user?.username}
        {#if $tournament.status=='registration'}  
          {#if !isRegister}
            <ButtonRegister/>
            {:else }
            <ButtonCancel/>
          {/if}
        {:else if $tournament.status=="running"}
          {#if !isActive}
            <ButtonReadyToPlay/>
            {:else }
            <ButtonStop/>
          {/if}
        {/if}
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
            <Badge title={`${tournamentInfo.control}`} color={{text:"text-slate-700 px-2 py-1", bg:"bg-slate-100"}}/>
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Формат</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <div class="">
              <Badge title={transformTournamentFormat(tournamentInfo.format)} color={{text:"text-orange-800 px-2 py-1", bg:"bg-orange-100"}}/>
              <Badge title={`${tournamentInfo.rounds} туров`} color={{text:"text-sky-800 px-2 py-1", bg:"bg-sky-100"}}/>

            </div>
          </dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Дата начала</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <div class=" flex items-center space-x-3">
              <div class="">

                {formatDate(tournamentInfo.startDate.getTime(),$time, $tournament.status)}
              </div>
              <Badge title={`${$tournament.currentRound} тур`} color={{text:"text-sky-800 px-2 py-1", bg:"bg-sky-100"}}/>

            </div>
          </dd>
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
