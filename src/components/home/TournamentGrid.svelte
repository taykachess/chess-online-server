<script lang="ts">
  import { Cog } from "svelte-hero-icons";
  import TournamentGridElement from "$components/home/TournamentGridElement.svelte";

  const tournaments = [
    {
      title: "Круговой турнир",
      description: "Каждый с каждым в один или в 2 круга.",
      svg: Cog,
    },
    {
      title: "Щвейцарка",
      description: "Игроки из одной группы предпочтительно играют между собой",
      svg: Cog,
    },
    {
      title: "Олимпийская система",
      description:
        "Турнир на выбывание, возможна вариация с двойным выбиванием",
      svg: Cog,
    },
    {
      title: "Арена",
      description:
        "Так называемый мод игры на lichess.org, в которой нет перерывов.",
      svg: Cog,
    },
  ];
</script>

<div
  class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0"
>
  {#each tournaments as tournament}
    <TournamentGridElement
      gridElement={{
        title: tournament.title,
        description: tournament.description,
        svg: tournament.svg,
      }}
    />
  {/each}
</div>
