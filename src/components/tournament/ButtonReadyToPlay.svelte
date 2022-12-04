<script lang="ts">
  import { page } from "$app/stores";

  async function ContinueOrStartToPlay() {
    await fetch(`/api/tournament/continue/${$page.params.id}`, {
      method: "POST",
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- prettier-ignore -->
<span on:click={ContinueOrStartToPlay} class="isolate inline-flex rounded-md shadow-sm shadow-slate-800 bg-white hover:bg-gray-50 ">
      <button  type="button" class="inline-flex items-center rounded-l border border-gray-300  px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
        Войти/Продолжить участие в турнире
      </button>  
      <button type="button" class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300  px-2.5 py-1.5 font-medium text-gray-700  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>    
      </button>
    </span>
