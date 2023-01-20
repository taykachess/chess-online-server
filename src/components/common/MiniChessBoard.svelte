<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { Chessboard, MARKER_TYPE, type Config } from 'cm-chessboard-ts'
  import { board, chess } from '$store/tournament/tournamentTv'

  const dispatcher = createEventDispatcher()

  let boardHTML: HTMLElement

  const config: Config = {
    orientation: 'w',
    responsive: true,
    position: $chess.fen(),
    style: {
      borderType: 'none',
      showCoordinates: false,
      aspectRatio: 1,
      cssClass: 'fancy-gray',
      moveFromMarker: MARKER_TYPE.square,
      moveToMarker: MARKER_TYPE.square,
    },
    sprite: {
      // -staunty
      url: '/assets/images/chessboard-sprite.svg', // pieces and markers are stored in a sprite file
      size: 40, // the sprite tiles size, defaults to 40x40px
      cache: true, // cache the sprite
    },
  }

  onMount(() => {
    $board = new Chessboard(boardHTML, config)

    dispatcher('boardMounted')
  })
</script>

<div class="relative flex-none overflow-hidden rounded-lg  ">
  <div bind:this={boardHTML} class="   " />
</div>

<style>
  @import '../../../static/assets/styles/cm-chessboard.css';
  @import '../../../static/assets/styles/promotion-dialog.css';
</style>
