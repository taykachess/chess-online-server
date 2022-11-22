<script lang="ts">
  export let boardHTML: HTMLElement;
</script>

<!-- 40rem is standart, so if make w-full is going to be problem -->
<div class="  relative    flex-none ">
  <div bind:this={boardHTML} class="   " />
</div>

<style>
  @import "/assets/styles/cm-chessboard.css";
</style>
