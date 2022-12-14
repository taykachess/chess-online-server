<script lang="ts">
  import { beforeNavigate } from "$app/navigation";
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import MiniChessBoard from "$components/common/MiniChessBoard.svelte";
  import { formatTime } from "$lib/utils/formatTime";
  import { socket } from "$store/sockets/socket";
  import { tournament } from "$store/tournament/tournament";
  import { tournamentTv } from "$store/tournament/tournamentTv";
  import type { GetGame } from "$types/game";
  import { Chess } from "cm-chess-ts";
  import type { ChessBoardInstance } from "cm-chessboard-ts";
  import { onMount } from "svelte";

  beforeNavigate(() => {
    $socket.removeListener("tournament:tv");
  });

  //   let board: ChessBoardInstance;
  //   const chess = new Chess();
</script>

<div class="  text-gray-800 ">
  {#if $tournamentTv && $tournamentTv.game}
    <!-- prettier-ignore -->
    <div class=" flex">
      <div class="">
        {#if $tournamentTv.game.black.title}
          <BadgeTitle title={$tournamentTv.game.black.title} />
        {/if}
        <span class=" font-medium text-slate-800">{$tournamentTv.game.black.username}</span>
        <span class=" text-xs text-orange-700"> {$tournamentTv.game.black.rating}</span>
      </div>
      <div class=" ml-auto">
        {formatTime($tournamentTv.game.time[1])}
      </div>
  </div>
    <div class=" overflow-hidden rounded-lg bg-blue-400 ">
      <!-- {#if $tournamentTv.chess} -->
      <MiniChessBoard
        bind:board={$tournamentTv.board}
        chess={$tournamentTv.chess}
      />
      <!-- {/if} -->
    </div>

    <!-- prettier-ignore -->
    <div class=" flex">
      <div class="">
        {#if $tournamentTv.game.white.title}
          <BadgeTitle title={$tournamentTv.game.white.title} />
        {/if}
        <span class=" font-medium text-slate-800">{$tournamentTv.game.white.username}</span>
        <span class=" text-xs text-orange-700"> {$tournamentTv.game.white.rating}</span>
      </div>
      <div class=" ml-auto">
        {formatTime($tournamentTv.game.time[0])}
      </div>

    </div>
  {/if}
</div>
