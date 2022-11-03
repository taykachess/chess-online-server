<script lang="ts">
  import TournamentGrid from "$components/home/TournamentGrid.svelte";

  import Table from "$components/common/Table.svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  const titles = ["Турнир", "Дата", "Тип", "Контроль", "Участники"];

  $: isAdmin = $page?.data?.user?.roles.find((role) => role.name === "ADMIN");

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

  onMount(async () => {
    const response = await fetch("/api/tournament/getAll", {
      method: "GET",
    });

    const tournaments: {
      id: string;
      name: string;
      format: string;
      control: string;
      playerLimit: number;
      startTime: Date;
      _count: {
        players: number;
      };
    }[] = await response.json();
    tournaments.forEach((tournament) => {
      records.push([
        tournament.name,
        `${formatDate(tournament.startTime)}`,
        tournament.format,
        tournament.control,
        `${tournament._count.players}/${tournament.playerLimit}`,
      ]);
      records = records;
    });
    console.log(tournaments);
  });

  export let records = [
    [
      "<span>Новогодний турнир</span>",
      "через 3 часа",
      "Щвейцарка",
      "3+0",
      "0/10",
    ],
    [
      "<span>Новогодний турнир</span>",
      "через 5 часов",
      "Щвейцарка",
      "1+0",
      "2/64",
    ],
    [
      "<span>Новогодний турнир</span>",
      "через 8 часов",
      "Олимпийская система",
      "15+10",
      "15/16",
    ],
    [
      "<span>Новогодний турнир</span>",
      "через 12 часа",
      "Щвейцарка",
      "10+10",
      "7/100",
    ],
  ];
</script>

<div class=" my-4" />
<div class=" mx-auto grid max-w-7xl {isAdmin ? 'grid-cols-2 gap-6 ' : ''}  ">
  {#if isAdmin}
    <TournamentGrid />
  {/if}
  <Table {titles} {records} />
</div>
