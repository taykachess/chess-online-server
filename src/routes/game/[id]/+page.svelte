<script lang="ts">
  import Board from "$components/game/Board.svelte";
  import { board } from "$store/game/board";
</script>

<Board fen="start" bind:board={$board} />
