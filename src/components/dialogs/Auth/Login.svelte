<script lang="ts">
  import IconExitDialog from '$components/icons/IconExitDialog.svelte'
  import LichessButton from './LichessButton.svelte'
  import YandexButton from './YandexButton.svelte'

  export let isOpen: boolean
</script>

<div class=" z-20  py-8 text-left">
  <div class="relative mx-auto mt-8  rounded-lg bg-white px-16 py-8 shadow-2xl ">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        isOpen = !isOpen
      }}
      class=" absolute right-[-0.5rem] top-[-0.5rem] h-6 w-6 cursor-pointer rounded-full border border-slate-500 bg-slate-200 p-px hover:bg-slate-300"
    >
      <IconExitDialog />
    </div>

    <h2 class="text-center text-2xl font-bold tracking-wide text-gray-800">Вход</h2>

    <div class=" mt-3 flex flex-col space-y-3">
      <LichessButton type="login" />
      <YandexButton type="login" />
    </div>
  </div>
</div>
