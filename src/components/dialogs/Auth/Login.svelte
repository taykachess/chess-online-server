<script lang="ts">
  import LichessButton from "./LichessButton.svelte";
  import YandexButton from "./YandexButton.svelte";

  export let isOpen: boolean;
</script>

<div class=" z-20  py-8 text-left">
  <!-- prettier-ignore -->
  <div class="relative mx-auto mt-8  rounded-lg bg-white px-16 py-8 shadow-2xl ">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        isOpen = !isOpen;
      }}
      class=" absolute right-[-0.5rem] top-[-0.5rem] cursor-pointer rounded-full border border-slate-500 bg-slate-200 p-px hover:bg-slate-300"
    >
      <!-- prettier-ignore -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>

    <h2 class="text-center text-2xl font-bold tracking-wide text-gray-800">
      Вход
    </h2>
    
    <div class=" flex flex-col space-y-3 mt-3">
      <LichessButton type="login"></LichessButton>
      <YandexButton type="login" ></YandexButton>

    </div>

  </div>
</div>
