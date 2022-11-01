<script lang="ts">
  import Dialog from "$components/common/Dialog.svelte";
  import { Icon, type IconSource } from "svelte-hero-icons";
  import CreateTable from "$components/home/CreateTournament.svelte";
  export let gridElement: {
    svg: IconSource;
    title: string;
    description: string;
  };
  let isOpen = false;
</script>

<Dialog bind:isOpen>
  <CreateTable bind:isOpen />
</Dialog>

<button
  on:click={() => {
    isOpen = true;
  }}
  class="group relative   bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 sm:rounded-tr-none"
>
  <div>
    <span
      class="inline-flex rounded-lg bg-teal-50 p-3 text-teal-700 ring-4 ring-white"
    >
      <!-- Heroicon name: outline/clock -->
      <Icon src={gridElement.svg} size="24" />
    </span>
  </div>
  <div class="mt-8">
    <h3 class="text-lg font-medium text-slate-700">
      <div class=" focus:outline-none">
        <!-- Extend touch target to entire panel -->
        <span class="absolute inset-0 " aria-hidden="true" />
        {gridElement.title}
      </div>
    </h3>
    <p class="mt-2 text-sm text-gray-500">
      {gridElement.description}
    </p>
  </div>
  <span
    class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
    aria-hidden="true"
  >
    <svg
      class="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
      />
    </svg>
  </span>
</button>
