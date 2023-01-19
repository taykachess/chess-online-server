<script lang="ts">
  export let title = 'Игра'
  export let active = false
</script>

<button type="button" class="group   flex flex-col items-center  font-semibold {active ? 'text-pink-500 dark:text-pink-400' : ' '}">
  <div class="  {active ? '' : 'text-slate-300 group-hover:text-slate-400'}  ">
    <slot />
  </div>
  {title}</button
>
