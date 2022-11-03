<script lang="ts">
  import Select from "$components/common/Select.svelte";
  import Table from "$components/common/Table.svelte";

  import Palleter from "$components/common/Palleter.svelte";
  import type { PalleterLi } from "$lib/types/palleter";
  import { Cog, Code } from "svelte-hero-icons";
  import { goto } from "$app/navigation";

  let palleterRecords: PalleterLi[] = [
    {
      title: "Игра со случайным соперником",
      description: "Вам будет выбран соперник исходя из ваших предпочтений",
      bg: "bg-indigo-500",
      svg: Cog,
    },
    {
      title: "Игра с другом",
      description: "Ваш друг может будет принять вызов по ссылке или напрямую",
      bg: "bg-green-500",
      svg: Code,
    },
  ];
  const titles = ["Игрок", "Рейтинг"];
  export let records = [
    ["<span class='text-green-500'>Taykas</span>", "2459"],
    ["<span>Tayka</span>", "2459"],
    ["<span>Tayka</span>", "2459"],
    ["<span>Tayka</span>", "2459"],
    ["<span>Tayka</span>", "2459"],
    ["<span>Tayka</span>", "2459"],
    ["<span>Tayka</span>", "2459"],
    ["<span>Tayka</span>", "2459"],
  ];
</script>

<div class=" my-4 flex items-center space-x-2">
  <Select
    options={[{ name: "Рейтинговая", value: "rating" }]}
    color={{ bg: " bg-indigo-100", text: "text-indigo-800" }}
  />
  <Select
    options={[{ name: "<span> &#177; 300 рейтинг</span>", value: "300" }]}
    color={{ bg: "bg-green-100", text: "text-green-800" }}
  />
  <Select
    options={[{ name: "3+0", value: "3+0" }]}
    color={{ bg: "bg-red-100", text: "text-red-800" }}
  />
  <Select
    options={[
      { name: "белые/черные", value: "w/b" },
      { name: "белые", value: "w" },
      { name: "черные", value: "b" },
    ]}
    color={{ bg: "bg-cyan-100", text: "text-cyan-800" }}
  />
  <Select
    options={[{ name: "бесплатно", value: "free" }]}
    color={{ bg: "bg-yellow-100", text: "text-yellow-800" }}
  />
</div>

<div class=" grid w-full max-w-7xl grid-cols-2 gap-x-4 ">
  <div class=" w-full   ">
    <Palleter records={palleterRecords} />
  </div>
  <div class=" w-full ">
    <Table
      {titles}
      {records}
      onClick={() => {
        goto("/game/1");
      }}
    />
  </div>
</div>
