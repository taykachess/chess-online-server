<script lang="ts">
  import { Switch, SwitchGroup } from '@rgossiaux/svelte-headlessui'

  function classNames(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(' ')
  }

  export let state: boolean = false
</script>

<div class="flex h-full w-screen items-start  ">
  <SwitchGroup as="div" class="flex items-center space-x-4">
    <Switch
      as="button"
      checked={state}
      on:change={(event) => (state = event.detail)}
      class={({ checked }) =>
        classNames(
          'relative inline-flex flex-shrink-0 h-6 border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline transition-colors ease-in-out duration-200',
          checked ? 'bg-green-700' : 'bg-gray-200'
        )}
      let:checked
    >
      <span class={classNames('inline-block w-5 h-5 bg-white rounded-full transform transition ease-in-out duration-200', checked ? 'translate-x-5' : 'translate-x-0')} />
    </Switch>
  </SwitchGroup>
</div>
