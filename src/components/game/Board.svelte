<script lang="ts">
  export let boardHTML: HTMLElement;
</script>

<!-- 40rem is standart, so if make w-full is going to be problem -->
<div class="  relative w-[36rem]   flex-none ">
  <div bind:this={boardHTML} class="  w-full  " />
</div>

<style>
  @import "/assets/styles/cm-chessboard.css";
</style>
