<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Dialog from "$components/common/Dialog.svelte";
  import Popover from "$components/common/Popover.svelte";
  import CreateUserForm from "$components/home/CreateUserForm.svelte";
  import LoginForm from "$components/home/LoginForm.svelte";
  import Logo from "$components/icons/Logo.svelte";
  let isOpen = false;
  let isOpenLogin = false;
</script>

<Dialog bind:isOpen>
  <CreateUserForm bind:isOpen />
</Dialog>
<Dialog bind:isOpen={isOpenLogin}>
  <LoginForm bind:isOpen={isOpenLogin} />
</Dialog>

<div class="border-b">
  <div
    class=" mx-4 flex h-16 max-w-7xl  items-center  justify-between sm:mx-auto   "
  >
    <!-- <div class=" ml-4">Chess</div> -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        goto("/");
      }}
      class=" flex cursor-pointer items-center space-x-2"
    >
      <div class="  h-8 w-8">
        <Logo />
      </div>
      <div class=" text-lg font-bold ">chessmate.com</div>
    </div>
    {#if !$page.data?.user}
      <div class=" flex items-center space-x-4 text-sm">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          on:click={() => {
            isOpenLogin = true;
          }}
          class=" cursor-pointer text-slate-700 hover:text-slate-900"
        >
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
    {:else}
      <Popover
        title={$page.data?.user?.username}
        rating={$page.data?.user?.rating}
      >
        <form
          on:keydown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              return false;
            }
          }}
          use:enhance={({ form, data, action, cancel }) => {
            console.log(data);
            return async ({ result, update }) => {
              // confirm(result.type);

              console.log(result);
              console.log(form);
              await update();
              console.log("Success", $page.form?.success);
              if ($page.form?.success) {
                localStorage.removeItem("token");
                isOpen = false;
              }
            };
          }}
          method="POST"
          action="/?/logout"
        >
          <button
            href="##"
            class=" rounded-md  px-2 py-2 text-sm font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
          >
            Выйти из аккаунта</button
          >
        </form>
      </Popover>
    {/if}
  </div>
</div>
