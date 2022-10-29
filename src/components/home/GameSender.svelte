<script lang="ts">
  import Badge from "$components/common/Badge.svelte";
  import Palleter from "$components/common/Palleter.svelte";
  import type { PalleterLi } from "$lib/types/palleter";
  import { Cog, Code } from "svelte-hero-icons";

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
</script>

<div class=" flex flex-col items-start">
  <div class=" mb-2 flex items-center space-x-2">
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
  </div>
  <Palleter records={palleterRecords} />
</div>
