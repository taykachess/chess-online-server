<script lang="ts">
  import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@rgossiaux/svelte-headlessui'
  import { Check, Icon } from 'svelte-hero-icons'
  import { createEventDispatcher } from 'svelte'
  export let options: { name: string; value: any }[] = [{ name: 'вы забыли', value: 'forgot' }]
  export let color: { bg: string; text: string } = {
    bg: 'bg-indigo-100',
    text: 'bg-indigo-800',
  }
  export let colorOptions = { bg: 'bg-white', hover: 'hover:bg-slate-300' }

  export let value: any = options[1].value
  let selectedOption: { name: string; value: any } | undefined = options.find((opt) => opt.value === value)

  const dispatch = createEventDispatcher()

  // function resetAll() {
  //   selectedOption = options[0];
  //   value = options[0].value;
  // }
  // $: selectedOption == undefined ? resetAll() : "";
</script>

<Listbox
  value={selectedOption}
  class="relative"
  on:change={(e) => {
    console.log('Dispatch change')
    selectedOption = e.detail
    value = e.detail.value
    dispatch('change')
  }}
>
  <ListboxButton class="inline-flex items-center rounded {color.bg} px-2 py-0.5 text-xs font-medium {color.text}">{@html selectedOption?.name}</ListboxButton>
  <ListboxOptions class="absolute top-0 z-10  rounded  {colorOptions.bg}  text-xs">
    {#each options as option (option.value)}
      <ListboxOption class="flex w-40 cursor-pointer items-center justify-between rounded px-2 py-0.5 {colorOptions.hover}" selected value={option} let:selected>
        {@html option.name}
        {#if selected}
          <Icon src={Check} size="10" />
        {/if}
      </ListboxOption>
    {/each}
  </ListboxOptions>
</Listbox>

<!-- <select
  value={title}
  class="inline-flex items-center rounded {color.bg} px-2 py-0.5 text-xs font-medium {color.text}"
>
  <option value={title}>{title}</option>
</select> -->
