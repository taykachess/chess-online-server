<script lang="ts">
  import Select from "$components/common/Select.svelte";
  import Table from "$components/common/Table.svelte";
  import Palleter from "$components/common/Palleter.svelte";
  import type { PalleterLi } from "$types/common/palleter";
  import { Cog, Code } from "svelte-hero-icons";

  const titles = ["Игрок", "Рейтинг", "Партий"];
  export let records: { link: string; records: string[] }[] = [
    {
      link: "",
      records: ["<span class='text-green-500'>Taykas</span>", "2459", "12"],
    },
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
  <Select
    options={[{ name: "Рейтинговая", value: "rating" }]}
    color={{ bg: " bg-indigo-100", text: "text-indigo-800" }}
  />
  <Select
    options={[{ name: "&#x00B1;300 рейтинг", value: "300" }]}
    color={{ bg: "bg-green-100", text: "text-green-800" }}
  />
  <Select
    options={[{ name: "3+0", value: "3+0" }]}
    color={{ bg: "bg-red-100", text: "text-red-800" }}
  />
  <Select
    options={[{ name: "белые/черные", value: "w/b" }]}
    color={{ bg: "bg-cyan-100", text: "text-cyan-800" }}
  />
  <Select
    options={[{ name: "бесплатно", value: "free" }]}
    color={{ bg: "bg-yellow-100", text: "text-yellow-800" }}
  />
  <Select
    options={[{ name: "12 партий", value: "12" }]}
    color={{ bg: "bg-orange-100", text: "text-orange-800" }}
  />
  <!-- <Select
    options={["Армагедон"]}
    color={{ bg: "bg-purple-100", text: "text-purple-800" }}
  /> -->
</div>

<div class="mx-auto grid max-w-7xl grid-cols-2  px-4 sm:px-6 md:px-8">
  <div class=" flex flex-col items-start">
    <Palleter records={palleterRecords} />
  </div>

  <!-- <Table {titles} {records} /> -->
</div>
