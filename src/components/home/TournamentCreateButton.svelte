<script lang="ts">
  import Dialog from '$components/common/Dialog.svelte'
  import CreateTournament from '$components/home/CreateTournament.svelte'

  let isOpen = false
</script>

<Dialog bind:isOpen>
  <CreateTournament bind:isOpen />
</Dialog>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  on:click={() => {
    isOpen = true
  }}
  class=" w-40 cursor-pointer rounded border 
  border-gray-300 bg-white px-2.5 py-1.5 text-center text-xs 
  font-medium text-gray-700 shadow-sm hover:bg-gray-100"
>
  Создать турнир
</div>
