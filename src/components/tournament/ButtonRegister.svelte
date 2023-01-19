<script lang="ts">
  import { page } from '$app/stores'
  import IconPersonPlus from '$components/icons/IconPersonPlus.svelte'

  async function Register() {
    await fetch(`/api/tournament/register/${$page.params.id}`, {
      method: 'POST',
    })
  }
</script>

<button on:click={Register} class="isolate inline-flex rounded-md bg-white shadow-sm shadow-slate-800 hover:bg-gray-50 ">
  <button
    type="button"
    class="inline-flex cursor-pointer items-center rounded-l border  border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700  shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  >
    Регистрация
  </button>
  <button
    type="button"
    class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300  px-2.5 py-1.5 font-medium text-gray-700  focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
  >
    <div class="h-4 w-4">
      <IconPersonPlus />
    </div>
  </button>
</button>
