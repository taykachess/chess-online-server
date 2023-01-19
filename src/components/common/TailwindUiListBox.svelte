<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  interface Option {
    text: string
    value: string | number
  }
  export let options: Option[] = [
    { text: '1+0', value: '1+0' },
    { text: '1+1', value: '1+1' },
    { text: '3+0', value: '3+0' },
    { text: '3+2', value: '3+2' },
    { text: '5+0', value: '5+0' },
    { text: '5+3', value: '5+3' },
    { text: '10+5', value: '10+5' },
  ]
  export let value = options[0].value
  const elWithValue = options.find((el) => el.value == value)
  let selectedOption: Option = elWithValue ? elWithValue : options[0]
  const dispatch = createEventDispatcher()

  let isOpen = false
</script>

<!-- prettier-ignore -->
<div class=" ">
    <div  class="block text-sm font-medium text-gray-700">Контроль игры </div>
    <div class="relative mt-1 cursor-pointer">
      <button on:click={()=>{isOpen=!isOpen;   }} type="button" class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
        <span class="inline-flex w-full truncate">
          <span class="truncate">{selectedOption.text}</span>
          <!-- <span class="ml-2 truncate text-gray-500">@tomcook</span> -->
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <!-- Heroicon name: mini/chevron-up-down -->
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
          </svg>
        </span>
      </button>
  
      <!--
        Select popover, show/hide based on select state.
  
        Entering: ""
          From: ""
          To: ""
        Leaving: "transition ease-in duration-100"
          From: "opacity-100"
          To: "opacity-0"
      -->
      {#if isOpen}
      <ul class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
        <!--
          Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.
  
          Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
        -->
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        {#each options as option }
            <li on:click={()=>{selectedOption = option; isOpen = false; value = option.value; dispatch("change"); }} class=" {selectedOption == option?" bg-sky-100":"text-gray-900"} relative cursor-default select-none py-2 pl-3 pr-9" id="listbox-option-0" role="option">
            <div class="flex">
                <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                <span class=" {selectedOption == option?"font-semibold":"font-normal"} truncate">{option.text}</span>
                <!-- Highlighted: "text-indigo-200", Not Highlighted: "text-gray-500" -->
                <!-- <span class="text-gray-500 ml-2 truncate">@wadecooper</span> -->
            </div>
    
            <!--
                Checkmark, only display for selected option.
    
                Highlighted: "text-white", Not Highlighted: "text-indigo-600"
            -->

            {#if option.value == selectedOption.value}
                
            <span class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                <!-- Heroicon name: mini/check -->
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
            </span>
            {/if}
            </li>
            
        {/each}
  
        <!-- More items... -->
      </ul>
            
        {/if}
    </div>
  </div>
