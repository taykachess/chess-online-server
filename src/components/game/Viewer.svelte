<script lang="ts">
  import { board } from "$store/game/board";
  import { info } from "$store/game/info";
  import { tree } from "$store/game/tree";

  function onClickOnMove(move: any) {
    $tree.currentNode = move;
    $board.setPosition(move.fen);
  }
  function redraw(node: HTMLElement) {
    console.log("redraw", node);
  }
</script>

{#if $tree?.history}
  <div class=" grid w-60    grid-cols-10  text-center text-slate-700">
    {#each $tree?.history as move}
      {#if move.ply % 2 != 0}
        <!-- {(move.ply - 1) % 4 == 0
            ? 'bg-pink-50'
            : ''} -->
        <div class=" col-span-2  rounded-lg   ">
          {Math.ceil(move.ply / 2)}
        </div>
      {/if}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        use:redraw
        on:click={() => onClickOnMove(move)}
        class="relative col-span-4 cursor-pointer rounded-lg hover:font-bold hover:text-blue-800 {$tree.currentNode ==
        move
          ? ' font-bold text-blue-800 '
          : ''} "
      >
        {move.san}
        {#if $tree.liveNode == move && $tree.currentNode != $tree.liveNode && $info.result == "*"}
          <div class=" absolute top-0 right-0">
            <span class=" relative flex h-3 w-3">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"
              />
              <span
                class="relative inline-flex h-3 w-3 rounded-full bg-sky-500"
              />
            </span>
          </div>
        {/if}
      </div>
    {/each}
    <!-- <div class="col-span-4 rounded-lg ">e5</div> -->
    <!-- <div class=" col-span-2  rounded-lg   ">2</div>
  <div class=" col-span-4 rounded-lg ">Nf3</div>
  <div class="col-span-4 rounded-lg bg-blue-50 ">Nc6</div>
  <div class=" col-span-2  rounded-lg bg-pink-50 ">3</div>
  <div class=" col-span-4 rounded-lg ">Bb5</div>
  <div class="col-span-4 rounded-lg ">e6</div> -->
  </div>
{/if}
