<script lang="ts">
  import TabWithSVG from '$components/common/TabWithSVG.svelte'
  import IconPuzzles from '$components/icons/IconPuzzles.svelte'
  import IconSwords from '$components/icons/IconSwords.svelte'
  import IconTrophy from '$components/icons/IconTrophy.svelte'
  import { TAB_NAME_LOCAL_STORAGE } from '$lib/variables/home'
  import { tab } from '$store/home/tab'
  import type { Tab } from '$types/frontend'

  function setTabToLocalStorage(value: Tab) {
    $tab = value
    localStorage.setItem(TAB_NAME_LOCAL_STORAGE, value)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<ul class="flex space-x-10">
  <li
    on:click={() => {
      setTabToLocalStorage('challenge')
    }}
  >
    <TabWithSVG title="Игра/Матч" active={$tab === 'challenge' ? true : false}>
      <div class=" mb-2 h-12 w-12">
        <IconSwords />
      </div>
    </TabWithSVG>
  </li>
  <li
    on:click={() => {
      setTabToLocalStorage('tournament')
    }}
  >
    <TabWithSVG title="Турнир" active={$tab === 'tournament' ? true : false}>
      <div class=" mb-2 h-12 w-12">
        <IconTrophy />
      </div>
    </TabWithSVG>
  </li>

  <li
    on:click={() => {
      setTabToLocalStorage('puzzle')
    }}
  >
    <TabWithSVG title="Задачки" active={$tab === 'puzzle' ? true : false}>
      <div class=" mb-2 h-12 w-12">
        <IconPuzzles />
      </div>
    </TabWithSVG>
  </li>
</ul>
