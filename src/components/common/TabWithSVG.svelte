<script lang="ts">
  export let title = "Игра";
  export let active = false;
</script>

<button
  type="button"
  class="group flex w-full flex-col items-center text-sm font-semibold {active
    ? 'text-pink-500 dark:text-pink-400'
    : ' '}"
>
  <div
    class="mb-6  {active ? '' : 'text-slate-300 group-hover:text-slate-400'}  "
  >
    <slot class=" " />
  </div>
  {title}</button
>
