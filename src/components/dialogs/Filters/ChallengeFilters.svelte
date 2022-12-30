<script lang="ts">
  import Badge from "$components/common/Badge.svelte";
  import Select from "$components/common/Select.svelte";
  import IconExitDialog from "$components/icons/IconExitDialog.svelte";
  import { CHALLENGE_FILTERS_LOCAL_STORAGE } from "$lib/variables/home";

  import { filters } from "$store/home/challenges";

  export let isOpen: boolean;
  function onChange() {
    console.log("changed ", $filters);
    localStorage.setItem(
      CHALLENGE_FILTERS_LOCAL_STORAGE,
      JSON.stringify($filters)
    );
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class=" relative z-10 aspect-square w-1/3 rounded-lg bg-white">
  <div
    on:click={() => {
      isOpen = !isOpen;
    }}
    class=" absolute right-[-0.5rem] top-[-0.5rem] h-6 w-6 cursor-pointer rounded-full border border-slate-500 bg-slate-200 p-px hover:bg-slate-300"
  >
    <IconExitDialog />
  </div>

  <div class="">
    <div class=" my-4 flex items-end ">
      {#if $filters}
        <Select
          bind:value={$filters.rating[0]}
          on:change={onChange}
          options={[
            { name: "-ထ", value: -500 },
            { name: "-100 ", value: -100 },
            { name: "-200", value: -200 },
            { name: "-300", value: -300 },
            { name: "-400", value: -400 },
          ]}
          color={{
            bg: "bg-pink-100 rounded-none rounded-l",
            text: "text-pink-800",
          }}
        />
        <Badge
          title={`Ваш рейтинг`}
          color={{ text: "text-slate-700 py-0.5 rounded-none", bg: "bg-white" }}
        />
        <Select
          bind:value={$filters.rating[1]}
          on:change={onChange}
          options={[
            { name: "+ထ", value: 500 },
            { name: "+100", value: 100 },
            { name: "+200", value: 200 },
            { name: "+300", value: 300 },
            { name: "+400", value: 400 },
          ]}
          color={{
            bg: "bg-green-100 rounded-none rounded-r",
            text: "text-green-800",
          }}
        />
      {/if}
    </div>
  </div>
</div>
