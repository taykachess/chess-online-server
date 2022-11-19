<script lang="ts">
  // import TournamentGrid from "$components/home/TournamentGrid.svelte";
  // import type { TournamentTab } from "$types/frontend";

  import Table from "$components/common/Table.svelte";
  import { page } from "$app/stores";
  import Tabs from "$components/common/Tabs.svelte";
  import { listOfTournaments } from "$store/home/tournaments";
  import { tournamentTab } from "$store/home/tounamentTab";

  import type { TournamentTableRecord } from "$types/tournament";
  import type { GetTournament } from "$types/tournament";

  function formatDate(datePar: Date): string {
    const now = new Date();
    const date = new Date(datePar);
    const diff = date.getTime() - now.getTime();
    if (diff < 0) return `Турнир прошел ${date.toLocaleString()}`;

    const MINUTE = 60 * 1000;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    if (diff < HOUR) return `Через ${Math.round(diff / MINUTE)} минут`;
    else if (diff < DAY)
      return `Через ${Math.round(diff / HOUR)} часов ${date.toLocaleString()}`;
    else return `${date.toLocaleString()}`;
  }

  async function getAllTournaments({
    page,
    register,
  }: {
    page: number;
    register?: "yes";
  }) {
    return fetch(`/api/tournament/getAll?page=${page}&register=${register}`, {
      method: "GET",
    });
  }

  async function getCountAllTournaments({ register }: { register?: "yes" }) {
    return fetch(`/api/tournament/count?register=${register}`, {
      method: "GET",
    });
  }

  async function onClickPagination(page: number) {
    const response = await getAllTournaments({ page });
    const tournaments: GetTournament[] = await response.json();
    $listOfTournaments.tournaments = tournaments;
  }

  async function onClickPaginationRegisted(page: number) {
    const response = await getAllTournaments({ page, register: "yes" });
    const tournaments: GetTournament[] = await response.json();
    $listOfTournaments.tournaments = tournaments;
  }

  async function getInitialTournaments() {
    const [tournamentsData, countData] = await Promise.all([
      getAllTournaments({ page: 1 }),
      getCountAllTournaments({}),
    ]);
    const tournaments: GetTournament[] = await tournamentsData.json();
    const count: number = await countData.json();
    $listOfTournaments.tournaments = tournaments;
    $listOfTournaments.count = count;
  }

  async function getInitialRegistedTournaments() {
    const [tournamentsData, countData] = await Promise.all([
      getAllTournaments({ page: 1, register: "yes" }),
      getCountAllTournaments({ register: "yes" }),
    ]);
    const tournaments: GetTournament[] = await tournamentsData.json();
    const count: number = await countData.json();
    $listOfTournaments.tournaments = tournaments;
    $listOfTournaments.count = count;
  }

  function createTournamentRecords(
    tournaments: GetTournament[] | null
  ): TournamentTableRecord[] {
    const arrayRecords: TournamentTableRecord[] = [];
    if (!tournaments) return [];
    tournaments.forEach((tournament) => {
      arrayRecords.push({
        link: `/tournament/${tournament.id}`,
        registered: tournament.players.length >= 1 ? true : false,
        records: [
          tournament.name,
          `${formatDate(tournament.startTime)}`,
          tournament.format,
          tournament.control,
          ` ${
            tournament.playerLimit
              ? `${tournament._count.players}/${tournament.playerLimit}`
              : `${tournament._count.players}`
          }`,
        ],
      });
    });

    return arrayRecords;
  }
  const titles = ["Турнир", "Дата", "Тип", "Контроль", "Участники"];

  $: isAdmin = $page?.data?.user?.roles.find((role) => role.name === "ADMIN");
  $: records = createTournamentRecords($listOfTournaments.tournaments);

  if ($tournamentTab == "all") {
    getInitialTournaments();
  } else if ($tournamentTab == "IRegistered") {
    getInitialRegistedTournaments();
  }
</script>

<!-- {isAdmin ? ' grid grid-cols-2 gap-6 ' : ''}  -->
<!-- {#if isAdmin}
    <TournamentGrid />
  {/if} -->
<div class=" flex flex-col">
  <Tabs
    bind:currentTab={$tournamentTab}
    tabs={[
      { active: "all", title: "Турниры", load: getInitialTournaments },
      {
        active: "IRegistered",
        title: "Зарегестрирован",
        load: getInitialRegistedTournaments,
        disabled: $page.data?.user ? false : true,
      },
      {
        active: "ICreated",
        title: "Созданные",
        load: () => {},
        disabled: true,
      },
    ]}
  />
  {#if $tournamentTab === "all"}
    <Table
      {titles}
      {records}
      {onClickPagination}
      count={$listOfTournaments.count}
    />
  {:else if $tournamentTab === "IRegistered"}
    {#if $page?.data?.user}
      <Table
        {titles}
        {records}
        onClickPagination={onClickPaginationRegisted}
        count={$listOfTournaments.count}
      />
    {:else}
      <div class=" w-[40rem] text-white">Зарегестрируйся</div>
    {/if}
  {/if}
</div>
