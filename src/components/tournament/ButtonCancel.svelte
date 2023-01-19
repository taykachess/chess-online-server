<script lang="ts">
  import { page } from '$app/stores'
  import IconPersonMinus from '$components/icons/IconPersonMinus.svelte'

  async function CancelRegister() {
    await fetch(`/api/tournament/unregister/${$page.params.id}`, {
      method: 'POST',
    })
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- prettier-ignore -->
<span on:click={CancelRegister} class="isolate inline-flex rounded-md shadow-sm shadow-slate-800 bg-red-100 hover:bg-red-50 ">
    <button  type="button" class="inline-flex items-center rounded-l border border-gray-300  px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
      Отменить регистрацию
    </button>  
    <button type="button" class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300  px-2.5 py-1.5 font-medium text-gray-700   focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
      <div class="w-4 h-4">
        <IconPersonMinus></IconPersonMinus>
      </div>             
    </button>
  </span>
