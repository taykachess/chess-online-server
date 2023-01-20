<script lang="ts">
  import IconUser from '$components/icons/IconUser.svelte'
  import { me } from '$store/global/me'
  import { socket } from '$store/sockets/socket'
  import { Button, Input, Label, Modal } from 'flowbite-svelte'
  import LichessButton from '../Auth/LichessButton.svelte'
  import YandexButton from '../Auth/YandexButton.svelte'

  let open = false
  let password = ''
  let username = ''

  async function login(e: Event) {
    e.stopPropagation()

    const formData = {
      password,
      username,
    }

    const res = await fetch('/api/auth/classic/login', { method: 'POST', body: JSON.stringify(formData) })

    if (!res.ok) {
      const { message } = await res.json()
      alert(message)
    }

    const token = await res.json()
    localStorage.setItem('token', token)

    window.location.reload()
    // $me = user
    // // @ts-ignore
    // $socket.auth.token = token
    // $socket.disconnect().connect()

    // open = false
  }
</script>

<button
  on:click={() => {
    open = true
  }}
  class=" cursor-pointer text-slate-700 hover:text-slate-900"
>
  Войти
</button>

<Modal title="Вход" bind:open autoclose>
  <form class="z-20  text-sm text-slate-800">
    <div class=" flex flex-col space-y-4">
      <Label class="space-y-2">
        <span>Имя пользователя</span>
        <Input bind:value={username} type="email" placeholder="">
          <div slot="left" class=" h-5 w-5">
            <IconUser />
          </div>
        </Input>
      </Label>
      <div class="">
        <Label for="password" class="mb-2">Пароль</Label>
        <Input bind:value={password} type="password" id="password" placeholder="•••••••••" required />
      </div>
    </div>
    <div class=" mt-4" />
    <div class=" flex justify-center ">
      <Button on:click={login}>Войти</Button>
    </div>

    <div class="my-3 flex items-center justify-between">
      <div class="h-[1px] w-full bg-gray-300" />
      <span class="mx-6 text-sm uppercase text-gray-400">Или</span>
      <div class="h-[1px] w-full bg-gray-300" />
    </div>

    <div class=" grid grid-cols-2 gap-x-3 ">
      <div class=" col-span-1 h-10">
        <LichessButton state={username} type="login" />
      </div>
      <div class=" col-span-1 h-10 ">
        <YandexButton state={username} type="login" />
      </div>
    </div>
  </form>
</Modal>
