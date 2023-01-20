<script lang="ts">
  import Board from '$components/game/Board.svelte'

  import { page } from '$app/stores'
  import { socket } from '$store/sockets/socket'
  import type { GetGame, Result } from '$types/game'
  import { Chess, type Move, type Square } from 'cm-chess-ts'
  import { MARKER_TYPE, INPUT_EVENT_TYPE, COLOR, type ChessBoardInstance } from 'cm-chessboard-ts'
  import { info } from '$store/game/info'
  import Timer from './Timer.svelte'
  import PlayerCard from './PlayerCard.svelte'
  import Viewer from './Viewer.svelte'
  import GameManager from './GameManager.svelte'
  import { board } from '$store/game/board'
  import { afterNavigate, beforeNavigate } from '$app/navigation'
  import MatchResults from './MatchResults.svelte'
  import { match } from '$store/game/match'

  import { onMount, tick } from 'svelte'
  import { TOURNAMENT_GAME_PREPARE_TIME } from '$sockets/variables/redisIndex'
  import { isTournamentTimerVisible, tournamentPrepareTime } from '$store/game/tournament'
  import { requestId } from '$store/game/requestId'
  import { clock } from '$store/game/clock'
  import MatchTimeInfo from './MatchTimeInfo.svelte'
  import type { Match } from '$types/match'
  import { gamesInProgress } from '$store/global/gamesInProgress'

  export let game: GetGame

  let lastTime: number
  let timerPrepareTournamentId: NodeJS.Timeout
  let timerTournamentPrepareTime: NodeJS.Timeout

  onMount(() => {
    onGetGame(game)
  })

  function enableMoveInputOnNavigate() {
    if ($info.white.username === $page.data.user?.username && $info.chess.turn() == 'w') {
      return $board.enableMoveInput(inputHandler, COLOR.white)
    }

    if ($info.black.username === $page.data.user?.username && $info.chess.turn() == 'b') {
      return $board.enableMoveInput(inputHandler, COLOR.black)
    }
  }

  async function onGetGame({ white, black, time, pgn, result, increment, lastOfferDraw, matchId, tournamentId, tsmp }: GetGame) {
    // await tick();
    const chess = new Chess()
    // @ts-ignore
    await chess.loadPgn(pgn)
    const tmpHistory = chess.history()
    $info = {
      chess,
      tree: {
        // @ts-ignore
        history: tmpHistory,
        // @ts-ignore
        currentNode: tmpHistory[tmpHistory.length - 1],
        // @ts-ignore
        liveNode: tmpHistory[tmpHistory.length - 1],
      },
      black,
      white,
      // time,
      result,
      pgn,
      matchId,
      increment,
      tournamentId,
      role: black.username === $page.data.user?.username ? 'b' : white.username === $page.data.user?.username ? 'w' : undefined,
      lastOfferDraw,
      ply: tmpHistory[tmpHistory.length - 1]
        ? // @ts-ignore
          tmpHistory[tmpHistory.length - 1].ply
        : 0,
    }

    $clock = time

    if ($board) {
      $board.setOrientation($info.black.username === $page.data.user?.username ? 'b' : 'w')
      $board.setPosition(chess.fen(), true)

      enableMoveInputOnNavigate()
    }

    if (result == '*') {
      // $socket.emit("game:sub", { gameId: $page.params.id });
      $socket.on('game:move', onMoveHandler)
      if (!$socket.hasListeners('game:end')) $socket.on('game:end', onEndHandler)

      const isTournamentGameBegins = $info.tournamentId && $info.ply == 0

      if (isTournamentGameBegins) {
        $tournamentPrepareTime = tsmp + TOURNAMENT_GAME_PREPARE_TIME - Date.now()
        if ($tournamentPrepareTime > 0) {
          $isTournamentTimerVisible = true
          timerPrepareTournamentId = setInterval(() => {
            $tournamentPrepareTime -= 1000
          }, 1000)
          timerTournamentPrepareTime = setTimeout(() => {
            startClock()
            $isTournamentTimerVisible = false
          }, $tournamentPrepareTime)
        } else startClock()
        // TOURNAMENT_GAME_PREPARE_TIME;
      } else {
        startClock()
      }
      // const turn = $info.chess.turn();
    }
  }

  function playClock(time: number) {
    if (lastTime) {
      const delta = time - lastTime
      if ($info.chess.turn() == 'w') {
        $clock[0] = $clock[0] - delta
      } else {
        $clock[1] = $clock[1] - delta
      }
    }
    lastTime = time
    $requestId = window.requestAnimationFrame(playClock)
  }

  function startClock() {
    $requestId = window.requestAnimationFrame(playClock)
  }

  function stopClock() {
    window.cancelAnimationFrame($requestId)
  }

  function incrementTimer(newTurn: 'w' | 'b') {
    if (!$info.increment) return
    if (newTurn == 'w') $clock[1] = $clock[1] + $info.increment * 1000
    else $clock[0] = $clock[0] + $info.increment * 1000
  }

  function onMoveHandler(move: string) {
    const result = $info.chess.move(move)
    if (result) {
      $info.tree.history = $info.tree.history
      $info.tree.liveNode = $info.tree.history[$info.tree.history.length - 1]
      $info.tree.currentNode = $info.tree.history[$info.tree.history.length - 1]
      $info.ply = $info.ply + 1

      $board.setPosition($info.chess.fen(), true)
      const newTurn = $info.chess.turn()
      incrementTimer(newTurn)
      if ($info.white.username === $page.data.user?.username && newTurn == 'w') {
        return $board.enableMoveInput(inputHandler, COLOR.white)
      }

      if ($info.black.username === $page.data.user?.username && newTurn == 'b') {
        return $board.enableMoveInput(inputHandler, COLOR.black)
      }
    } else {
      console.warn('invalid move', move, $info.chess.fen())
    }
  }

  function onEndHandler({ result, newEloBlack, newEloWhite }: { result: Result; newEloBlack: number; newEloWhite: number }) {
    stopClock()
    $info.result = result

    $info.white.ratingNext = newEloWhite
    $info.black.ratingNext = newEloBlack

    const index = $gamesInProgress.indexOf($page.params.id)

    if (index !== -1) {
      $gamesInProgress.splice(index, 1)
      $gamesInProgress = $gamesInProgress
    }

    $board.disableMoveInput()
  }
  function inputHandler(event: { chessboard: ChessBoardInstance; type: string; square: string; squareFrom: Square; squareTo: Square; piece: string }) {
    event.chessboard.removeMarkers(MARKER_TYPE.dot)
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
      const moves = $info.chess.moves({ square: event.square, verbose: true })
      for (const move of moves) {
        // draw dots on possible squares
        event.chessboard.addMarker(MARKER_TYPE.dot, move.to)
      }
      return moves.length > 0
    } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
      let move: Pick<Move, 'from' | 'to' | 'promotion'> = {
        from: event.squareFrom,
        to: event.squareTo,
      }

      const moves = $info.chess.moves({
        square: event.squareFrom,
        verbose: true,
      })

      if (
        (event.squareTo.charAt(1) === '8' || event.squareTo.charAt(1) === '1') &&
        event.piece.charAt(1) === 'p' &&
        moves?.some((move) => move.to == event.squareTo && move.from == event.squareFrom)
      ) {
        // @ts-ignore
        return event.chessboard.showPromotionDialog(
          // @ts-ignore
          event.squareTo,
          $info.chess.turn(),
          (event: any) => {
            if (event.piece) {
              // resolve(event.piece[1]);
              move.promotion = event.piece[1]
              const result = $info.chess.move(move)

              if (result) {
                $board.disableMoveInput()
                $board.state.moveInputProcess.then(() => {
                  // wait for the move input process has finished
                  $board.setPosition($info.chess.fen(), false).then(() => {
                    // update position, maybe castled and wait for animation has finished

                    $socket.emit('game:move', {
                      move: result.san,
                      gameId: $page.params.id,
                    })

                    $info.ply = $info.ply + 1

                    $info.tree.history = $info.tree.history
                    $info.tree.liveNode = $info.tree.history[$info.tree.history.length - 1]
                    $info.tree.currentNode = $info.tree.history[$info.tree.history.length - 1]

                    const newTurn = $info.chess.turn()
                    incrementTimer(newTurn)
                  })
                })
              } else {
                console.warn('invalid move', move, $info.chess.fen())
              }
              // event.chessboard.setPiece(event.square, event.piece, true);
            } else {
              // await $board.setPosition(pos);
            }
          }
        )
      }

      // });

      // const promotionPiece = await promise;
      // if (promotionPiece) move.promotion = promotionPiece;

      // @ts-ignore
      const result = $info.chess.move(move)

      if (result) {
        $board.disableMoveInput()
        $board.state.moveInputProcess.then(() => {
          // wait for the move input process has finished
          $board.setPosition($info.chess.fen(), false).then(() => {
            // update position, maybe castled and wait for animation has finished

            $socket.emit('game:move', {
              move: result.san,
              gameId: $page.params.id,
            })

            $info.ply = $info.ply + 1

            $info.tree.history = $info.tree.history
            $info.tree.liveNode = $info.tree.history[$info.tree.history.length - 1]
            $info.tree.currentNode = $info.tree.history[$info.tree.history.length - 1]

            const newTurn = $info.chess.turn()
            incrementTimer(newTurn)
          })
        })
      } else {
        console.warn('invalid move', move, $info.chess.fen())
      }
      return result
    }
  }

  async function getMatch(id: string) {
    const matchData = await fetch(`/api/match/get/${id}`)
    const matchFromServer = (await matchData.json()) as Match

    console.log('got match')
    $match = matchFromServer
    $match.id = id
    if ($match.status == 'running') $socket.emit('match:subscribe', id)

    if ($match.type == 'time') {
      if (!$match.resultsData) $match.resultsData = []

      if (!$socket.hasListeners('match:private:gameOver'))
        $socket.on('match:private:gameOver', (res) => {
          if (!$match) return
          $match.resultsData.push(res.res)
          $match.resultsData = $match.resultsData
          if (res.curr) $match.currentGame = res.curr
          if (res.stage) $match.stage = res.stage
          if (res.tsmp) $match.tsmp = res.tsmp
        })

      if (!$socket.hasListeners('match:private:ended'))
        $socket.on('match:private:ended', () => {
          $match.status = 'finished'
        })
    }
  }

  afterNavigate(async ({ from, to }) => {
    if (to?.route.id == from?.route.id && to?.params?.id != from?.params?.id) {
      lastTime = 0
      $socket.emit('game:get', { gameId: $page.params.id }, async (gameFromServer) => {
        if (gameFromServer) {
          await onGetGame(gameFromServer)
          if ($info.matchId && $info.matchId != $match.id) {
            await getMatch($info.matchId)
          }
        }
      })
    }
  })

  beforeNavigate(async ({ from, to }) => {
    if (timerPrepareTournamentId) clearInterval(timerPrepareTournamentId)
    if (timerTournamentPrepareTime) clearInterval(timerTournamentPrepareTime)
    if ($isTournamentTimerVisible) $isTournamentTimerVisible = false
    // Нужно выйти их игры, только если партия продолжается
    // потому что иначе выход из комнаты осуществляется на сервере
    if ($info.result == '*') {
      $socket.emit('game:leave', { gameId: $page.params.id })
    }
  })

  $: orientation = $info?.black?.username === $page.data.user?.username ? 'b' : 'w'
</script>

<!-- <div class="">
  <div class="text-3xl text-slate-900">♕ ♔ ♗ ♘ ♖ ♙</div>
  <div class="text-3xl text-slate-900">♛ ♚ ♝ ♞ ♜ ♟︎ ♟︎</div>
</div> -->

<div class=" z-0  grid w-full  max-w-7xl md:grid-cols-10 ">
  <div class=" col-span-2">
    {#if $match && $match.type == 'time' && $match.stage && $match.tsmp}
      <MatchTimeInfo periods={$match.periodsData} bind:stage={$match.stage} bind:timestamp={$match.tsmp} />
    {/if}
  </div>

  <div class=" col-span-5">
    {#if $info && $info.chess}
      <Board {inputHandler} position={$info.chess.fen()} orientation={$info.black.username === $page.data.user?.username ? 'b' : 'w'} />
    {/if}
  </div>

  {#if $info}
    <div class="col-span-2 ml-3 flex  {orientation == 'w' ? 'flex-col' : 'flex-col-reverse'} justify-between">
      <div class=" flex {orientation == 'w' ? 'flex-col' : 'flex-col-reverse'} ">
        <!-- TODO: Get rid of bind -->

        <PlayerCard bind:player={$info.black} />
        <Timer bind:time={$clock[1]} side="b" />
      </div>

      <div class=" ">
        <div class=" max-h-40 overflow-y-scroll rounded-l-lg border-y border-slate-600">
          <Viewer />
        </div>

        <GameManager />
      </div>
      <div class="flex {orientation == 'w' ? 'flex-col-reverse' : 'flex-col'}">
        <!-- TODO: Get rid of bind -->
        <PlayerCard bind:player={$info.white} />
        <Timer bind:time={$clock[0]} side="w" />
      </div>
    </div>
    <!-- {#if $info.matchId} -->

    <!-- {/if} -->
  {/if}
</div>

{#if $match && $match.type == 'time'}
  <div class=" mt-8 flex justify-center ">
    <MatchResults bind:results={$match.resultsData} periods={$match.periodsData} />
  </div>
{/if}
