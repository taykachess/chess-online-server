<script lang="ts">
  import Dialog from "$components/common/Dialog.svelte";
  import CreateUserForm from "$components/home/CreateUserForm.svelte";
  import Logo from "$components/icons/Logo.svelte";

  let isOpen = false;
</script>

<Dialog bind:isOpen>
  <CreateUserForm bind:isOpen />
</Dialog>

<div class="border-b">
  <div class=" mx-auto flex h-16  max-w-7xl  items-center justify-between   ">
    <!-- <div class=" ml-4">Chess</div> -->
    <div class=" flex items-center space-x-2">
      <div class="  h-8 w-8">
        <Logo />
      </div>
      <div class=" text-lg font-bold ">chessmate.com</div>
    </div>

    <div class=" flex items-center space-x-4 text-sm">
      <div class=" cursor-pointer text-slate-700 hover:text-slate-900">
        Войти
      </div>
      <button
        on:click={() => {
          isOpen = true;
        }}
        class=" rounded bg-blue-400 p-2 text-white hover:bg-blue-500  "
      >
        Регистрация
      </button>
    </div>
  </div>
</div>
