<script lang="ts">
  export let onClick: (event: Event) => any

  export let color: 'white' | 'red' | 'green' | 'blue'
  export let text: string

  let bgClass: string
  let hoverClass: string
  let shadowClass: string
  let borderClass: string
  let textClass: string

  switch (color) {
    case 'white': {
      bgClass = 'bg-white'
      shadowClass = 'shadow-slate-800'
      hoverClass = 'hover:bg-gray-50'
      borderClass = 'border-gray-300'
      textClass = 'text-gray-700'
      break
    }
    case 'red': {
      bgClass = 'bg-white'
      shadowClass = 'shadow-red-800'
      hoverClass = 'hover:bg-red-50'
      borderClass = 'border-red-300'
      textClass = 'text-red-700'
      break
    }
    case 'green': {
      bgClass = 'bg-white'
      shadowClass = 'shadow-green-800'
      hoverClass = 'hover:bg-green-50'
      borderClass = 'border-green-300'
      textClass = 'text-green-700'
      break
    }
  }
</script>

<button on:click={onClick} class=" flex cursor-pointer rounded-md font-medium {bgClass} shadow-sm {shadowClass} {hoverClass} ">
  <div class="  items-center rounded-l border  {borderClass} px-2.5 py-1.5 text-xs  {textClass}  shadow-sm">
    {@html text}
    <slot name="badges" />
    <!-- {text} -->
  </div>
  <div class="relative -ml-px  items-center rounded-r-md border {borderClass}  px-2.5 py-1.5 {textClass}">
    <div class="h-4 w-4">
      <slot name="icon" />
    </div>
  </div>
</button>
