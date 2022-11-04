<script lang="ts">
  import { tournamentTab } from "$store/home/tounamentTab";
  import type { TournamentTab } from "$types/home/tab";

  const tabs: { active: TournamentTab; title: string }[] = [
    { active: "all", title: "Турниры" },
    { active: "IRegistered", title: "Зарегестрирован" },
    { active: "ICreated", title: "Созданные" },
  ];
</script>

<div class="mb-2 flex space-x-1 rounded-xl bg-blue-400/20 p-1">
  {#each tabs as tab}
    <button
      on:click={() => {
        $tournamentTab = tab.active;
      }}
      id="headlessui-tabs-tab-1"
      role="tab"
      type="button"
      aria-selected="false"
      tabindex="-1"
      class="w-full rounded-lg {$tournamentTab == tab.active
        ? 'bg-white text-slate-700 '
        : 'hover:bg-white/[0.12] hover:text-white'}  py-2.5 text-sm font-medium leading-5  ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400  focus:outline-none focus:ring-2"
      >{tab.title}
    </button>
  {/each}
</div>
