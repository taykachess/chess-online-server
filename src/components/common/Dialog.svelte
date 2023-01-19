<script lang="ts">
  import { Dialog, DialogOverlay, Transition, TransitionChild } from '@rgossiaux/svelte-headlessui'

  export let isOpen = false
</script>

<Transition class=" fixed" bind:show={isOpen} on:afterLeave={() => console.log('done')}>
  <!-- on:close={() => (isOpen = false)} -->
  <Dialog>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-75" leave="ease-in duration-200" leaveFrom="opacity-75" leaveTo="opacity-0" entered="opacity-75">
          <DialogOverlay class="fixed inset-0 bg-gray-500/80 transition-opacity duration-500" />
        </TransitionChild>

        <TransitionChild
          enter="ease-out transform duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in transform duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <!-- This element is to trick the browser into centering the modal contents. -->

          <!-- <div class=" z-10 h-10 w-1/2 bg-white sm:align-middle">Super</div> -->
          <div class=" flex h-screen items-center justify-center ">
            <slot />
          </div>
        </TransitionChild>
      </div>
    </div>
  </Dialog>
</Transition>
