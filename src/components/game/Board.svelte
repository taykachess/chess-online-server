<script lang="ts">
  import { Chessground } from "chessground";
  import type { Api } from "chessground/api";
  import type { Config } from "chessground/config";
  export let board: Api;
  export let config: Config;
  const create = (node: HTMLElement) => {
    board = Chessground(node, config);
  };
</script>

<div class=" blue merida aspect-square w-96">
  <div use:create class=" merida " />
</div>

<style>
  @import "$lib/cgstyles/theme.css";
  @import "$lib/cgstyles/chessground.css";
</style>
