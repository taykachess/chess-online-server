<script lang="ts">
  import ColorShadowButton from '$components/common/Buttons/ColorShadowButton.svelte'
  import IconAxe from '$components/icons/IconAxe.svelte'
  import IconCheck from '$components/icons/IconCheck.svelte'
  import { Button, FloatingLabelInput, Label, Modal, Range, Search } from 'flowbite-svelte'
  let defaultModal = false
  let requestId: any
  let players: { username: string }[] = []

  let friend: string | null = null
  let time: number = 3
  let increment: number = 2

  let friendFieldComplete = false

  let formData = {
    player: '',
  }

  async function onInput(event: any) {
    friendFieldComplete = false
    friend = null
    players = []
    clearTimeout(requestId)
    requestId = setTimeout(async () => {
      const data = await fetch(`/api/user/${event.target.value}/startsWith`)
      const users = await data.json()
      players = users
      console.log(event.target.value, JSON.stringify(users))
    }, 2000)
  }
</script>

<div class="">
  <ColorShadowButton color="green" text="Создать ИГРУ с другом" onClick={() => (defaultModal = true)}>
    <div slot="icon" class="">
      <IconAxe />
    </div>
  </ColorShadowButton>
</div>
<!-- <Button color={'green'} on:click={() => (defaultModal = true)}>Игра с другом</Button> -->
<Modal title="Игра с другом" bind:open={defaultModal} autoclose>
  <form>
    <div class=" relative  h-20 w-1/2  ">
      <div class="flex items-center space-x-2">
        <div class=" relative">
          <Search on:input={onInput} bind:value={formData.player} placeholder="игрок" size="sm" />

          {#if players.length && friend == null}
            <div class=" absolute w-full ">
              <div class="z-20 flex  flex-col border   ">
                {#each players as player}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div
                    on:click={() => {
                      friend = player.username
                      formData.player = player.username
                      friendFieldComplete = true
                    }}
                    class=" cursor-pointer text-center text-sm text-slate-800 hover:text-sky-700 "
                  >
                    {player.username}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
        <div class="h-6 w-6 text-green-700 {friendFieldComplete ? '' : 'invisible'}">
          <IconCheck />
        </div>
      </div>
    </div>

    <div class=" flex space-x-8">
      <div class=" w-1/2">
        <Label>Время</Label>
        <Range bind:value={time} min="1" max="15" />
        <p>{time} минут</p>
      </div>
      <div class=" w-1/2">
        <Label>Добавление</Label>
        <Range bind:value={increment} min="1" max="15" />
        <p>{increment} секунд</p>
      </div>
    </div>
    <!-- <FloatingLabelInput style="outlined" label="Player" /> -->
    <div class="" />
  </form>
  <svelte:fragment slot="footer">
    <div class=" flex w-full justify-end space-x-2">
      <Button color="alternative">Отмена</Button>
      <Button on:click={() => alert('Handle "success"')}>Отправить вызов</Button>
    </div>
  </svelte:fragment>
</Modal>
