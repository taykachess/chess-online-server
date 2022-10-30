<script lang="ts">
  import Badge from "$components/common/Badge.svelte";
  import Table from "$components/common/Table.svelte";
  import Palleter from "$components/common/Palleter.svelte";
  import type { PalleterLi } from "$lib/types/palleter";
  import { Cog, Code } from "svelte-hero-icons";

  const titles = ["Игрок", "Рейтинг", "Партий"];
  export let records = [
    ["<span class='text-green-500'>Taykas</span>", "2459", "12"],
    ["<span>Tayka</span>", "2459", "15"],
    ["<span>Tayka</span>", "2459", "9"],
    ["<span>Tayka</span>", "2459", "14"],
    ["<span>Tayka</span>", "2459", "10"],
    ["<span>Tayka</span>", "2459", "8"],
    ["<span>Tayka</span>", "2459", "6"],
    ["<span>Tayka</span>", "2459", "8"],
  ];

  let palleterRecords: PalleterLi[] = [
    {
      title: "Матч со случайным соперником",
      description: "Вам будет выбран соперник исходя из ваших предпочтений",
      bg: "bg-indigo-500",
      svg: Cog,
    },
    {
      title: "Матч с другом",
      description: "Ваш друг может будет принять вызов по ссылке или напрямую",
      bg: "bg-green-500",
      svg: Code,
    },
  ];
</script>

<div class=" my-4 flex items-center space-x-2">
  <Badge
    title="Рейтинговая"
    color={{ bg: " bg-indigo-100", text: "text-indigo-800" }}
  />
  <Badge
    title="&#x00B1;300 рейтинг"
    color={{ bg: "bg-green-100", text: "text-green-800" }}
  />
  <Badge title="3+0" color={{ bg: "bg-red-100", text: "text-red-800" }} />
  <Badge
    title="белые/черные"
    color={{ bg: "bg-cyan-100", text: "text-cyan-800" }}
  />
  <Badge
    title="бесплатно"
    color={{ bg: "bg-yellow-100", text: "text-yellow-800" }}
  />
  <Badge
    title="12 партий"
    color={{ bg: "bg-orange-100", text: "text-orange-800" }}
  />
  <Badge
    title="Армагедон"
    color={{ bg: "bg-purple-100", text: "text-purple-800" }}
  />
</div>

<div class="mx-auto grid max-w-7xl grid-cols-2  px-4 sm:px-6 md:px-8">
  <div class=" flex flex-col items-start">
    <Palleter records={palleterRecords} />
  </div>

  <Table {titles} {records} />
</div>
