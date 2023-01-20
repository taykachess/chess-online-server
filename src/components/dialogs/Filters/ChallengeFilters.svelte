<script lang="ts">
  import TailwindUiListBox from '$components/common/TailwindUiListBox.svelte'
  import { CHALLENGE_FILTERS_LOCAL_STORAGE } from '$lib/variables/home'

  import { filters } from '$store/home/challenges'

  export let isOpen: boolean
  function onChange() {
    console.log('changed ', $filters)
    localStorage.setItem(CHALLENGE_FILTERS_LOCAL_STORAGE, JSON.stringify($filters))
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class=" relative z-10 flex aspect-square w-1/3 flex-col items-center justify-center rounded-lg bg-white p-8">
  <div class=" flex">
    <div class=" my-4 flex w-full items-end  ">
      <!-- {#if $filters} -->
      <!-- <Select
          bind:value={$filters.rating[0]}
          on:change={onChange}
          options={[
            { name: '-ထ', value: -500 },
            { name: '-100 ', value: -100 },
            { name: '-200', value: -200 },
            { name: '-300', value: -300 },
            { name: '-400', value: -400 },
          ]}
          color={{
            bg: 'bg-pink-100 rounded-none rounded-l',
            text: 'text-pink-800 border text-base',
          }}
        />
        <Badge
          title={`Ваш рейтинг`}
          color={{
            text: 'text-slate-700 py-0.5 rounded-none ',
            bg: 'bg-white border-y text-base',
          }}
        />
        <Select
          bind:value={$filters.rating[1]}
          on:change={onChange}
          options={[
            { name: '+ထ', value: 500 },
            { name: '+100', value: 100 },
            { name: '+200', value: 200 },
            { name: '+300', value: 300 },
            { name: '+400', value: 400 },
          ]}
          color={{
            bg: 'bg-green-100 rounded-none rounded-r',
            text: 'text-green-800 border text-base',
          }}
        />
      {/if} -->
    </div>
  </div>

  <div class=" w-40">
    <TailwindUiListBox on:change={onChange} bind:value={$filters.control} />
    <!-- <input type="number" name="" id="" /> -->
  </div>
</div>
