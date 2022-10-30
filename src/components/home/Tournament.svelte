<script lang="ts">
  import TournamentGrid from "$components/home/TournamentGrid.svelte";

  import Table from "$components/common/Table.svelte";

  const titles = ["Турнир", "Дата", "Тип", "Участники"];
  export let records = [
    ["<span>Новогодний турнир</span>", "через 3 часа", "Щвейцарка", "0/10"],
    ["<span>Новогодний турнир</span>", "через 5 часов", "Щвейцарка", "2/64"],
    [
      "<span>Новогодний турнир</span>",
      "через 8 часов",
      "Олимпийская система",
      "15/16",
    ],
    ["<span>Новогодний турнир</span>", "через 12 часа", "Щвейцарка", "7/100"],
  ];
</script>

<div class=" my-4" />
<div class=" mx-auto grid max-w-7xl grid-cols-2  px-4 sm:px-6 md:px-8">
  <TournamentGrid />
  <Table {titles} {records} />
</div>
