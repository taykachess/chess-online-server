<script lang="ts">
  import TabWithSVG from "$components/common/TabWithSVG.svelte";
  import IconPuzzles from "$components/icons/IconPuzzles.svelte";
  import IconSwords from "$components/icons/IconSwords.svelte";
  import IconTrophy from "$components/icons/IconTrophy.svelte";
  import { tab } from "$store/home/tab";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<ul class="flex space-x-10">
  <li
    on:click={() => {
      $tab = "challenge";
    }}
  >
    <TabWithSVG title="Игра/Матч" active={$tab === "challenge" ? true : false}>
      <div class=" mb-2 h-12 w-12">
        <IconSwords />
      </div>
    </TabWithSVG>
  </li>
  <li
    on:click={() => {
      $tab = "tournament";
    }}
  >
    <TabWithSVG title="Турнир" active={$tab === "tournament" ? true : false}>
      <div class=" mb-2 h-12 w-12">
        <IconTrophy />
      </div>
    </TabWithSVG>
  </li>

  <li
    on:click={() => {
      $tab = "puzzle";
    }}
  >
    <TabWithSVG title="Задачки" active={$tab === "puzzle" ? true : false}>
      <div class=" mb-2 h-12 w-12">
        <IconPuzzles />
      </div>
    </TabWithSVG>
  </li>
</ul>
