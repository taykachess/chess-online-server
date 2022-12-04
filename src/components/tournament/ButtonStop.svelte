<script lang="ts">
  import { page } from "$app/stores";

  async function Pause() {
    await fetch(`/api/tournament/pause/${$page.params.id}`, {
      method: "POST",
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- prettier-ignore -->
<span on:click={Pause} class="isolate inline-flex rounded-md shadow-sm shadow-slate-800 bg-red-100 hover:bg-red-50 ">
      <button  type="button" class="inline-flex items-center rounded-l border border-gray-300  px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
        Сделать перерыв
      </button>  
      <button type="button" class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300  px-2.5 py-1.5 font-medium text-gray-700  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>            
      </button>
    </span>
