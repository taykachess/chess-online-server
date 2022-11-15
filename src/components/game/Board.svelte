<script lang="ts">
  export let boardHTML: HTMLElement;
</script>

<div bind:this={boardHTML} class=" w-[40rem] " />

<style>
  @import "/assets/styles/cm-chessboard.css";
</style>
