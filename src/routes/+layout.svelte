<script lang="ts">
  import Header from "$components/layout/Header.svelte";
  import "../app.postcss";
  import type { LayoutData } from "./$types";
  export let data: LayoutData;
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<Header />
<main class="  text-slate-500  ">
  <slot />
</main>

<style>
</style>
