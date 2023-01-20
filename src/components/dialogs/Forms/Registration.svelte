<script lang="ts">
  import { enhance } from '$app/forms'
  import { page } from '$app/stores'
  import IconCheck from '$components/icons/IconCheck.svelte'
  import IconEnvelop from '$components/icons/IconEnvelop.svelte'
  import IconQuestionMarkCircle from '$components/icons/IconQuestionMarkCircle.svelte'
  import IconUser from '$components/icons/IconUser.svelte'
  import IconXCircle from '$components/icons/IconXCircle.svelte'
  import { setCookie } from '$lib/utils/cookie'
  import { me } from '$store/global/me'
  import { socket } from '$store/sockets/socket'
  import type { createUserEmailPassDto } from '$types/user'
  import { Button, FloatingLabelInput, Helper, Input, Label, Modal, Range, Search, Popover, Toggle, Heading, List, Li } from 'flowbite-svelte'
  import LichessButton from '../Auth/LichessButton.svelte'
  import YandexButton from '../Auth/YandexButton.svelte'

  let isTitlePlayer = false

  let username = ''
  let email = ''
  let password = ''
  let passwordConfirmed = ''

  $: isValidUsernameLong = (username.match(/^.{5,18}$/g) || []).length == 1
  $: isValidUsernameString = (username.match(/^[a-zA-Z0-9]{0,}$/g) || []).length == 1
  let isUniqueUsername: boolean | null = null

  $: validationDone = isValidUsernameLong && isValidUsernameString && isUniqueUsername
  $: clientValidationDone = isValidUsernameLong && isValidUsernameString
  $: validationFull = isValidUsernameLong && isValidUsernameString && isUniqueUsername && terms

  let terms = true

  async function isUniqueUser(username: string) {
    const data = await fetch(`/api/user/${username}/isUnique`)
    if (data.status == 200) {
      isUniqueUsername = await data.json()
    }
  }

  let timerId: NodeJS.Timeout

  async function inputHandler(event: any) {
    isUniqueUsername = null
    clearTimeout(timerId)
    const isValidUsernameLong = (event.target.value.match(/^.{5,18}$/g) || []).length == 1
    const isValidUsernameString = (event.target.value.match(/^[a-zA-Z0-9]{0,}$/g) || []).length == 1

    if (isValidUsernameLong && isValidUsernameString) {
      timerId = setTimeout(async () => {
        await isUniqueUser(event.target.value)
      }, 200)
    }
  }
  let open: boolean = false

  async function registration(e: Event) {
    e.stopPropagation()
    if (password != passwordConfirmed) return

    const formData: createUserEmailPassDto = {
      username,
      email,
      password,
    }

    const res = await fetch('/api/auth/classic/register', { method: 'POST', body: JSON.stringify(formData) })

    if (!res.ok) return

    const token = await res.json()

    localStorage.setItem('token', token)

    window.location.reload()

    // $me = user
    // localStorage.setItem('token', token)
    // // @ts-ignore
    // $socket.auth.token = token
    // $socket.disconnect().connect()
    // setCookie('token', token)

    // open = false
    // console.log('res', await res.)
  }
</script>

<button
  on:click={() => {
    open = true
  }}
  class=" rounded bg-blue-400 p-2 text-white hover:bg-blue-500  "
>
  Регистрация
</button>

<Modal title="Регистрация" bind:open autoclose>
  <form class="z-20 my-4 text-sm text-slate-800">
    <div class=" flex flex-col">
      <Label for="success" color={validationDone ? 'green' : clientValidationDone && isUniqueUsername == null ? 'gray' : 'red'} class="mb-2 block">Имя пользователя</Label>
      <Input on:input={inputHandler} id="success" bind:value={username} color={validationDone ? 'green' : clientValidationDone && isUniqueUsername == null ? 'base' : 'red'}>
        <div slot="left" class=" h-5 w-5">
          <IconUser />
        </div>
      </Input>
      <Helper class="mt-2" color={validationDone ? 'green' : clientValidationDone && isUniqueUsername == null ? 'gray' : 'red'}>
        {#if validationDone}
          <span class="font-medium">Отлично!</span> Такого пользователя можно создать.
        {:else if clientValidationDone && isUniqueUsername == null}
          <span class="font-medium">Идет проверка на уникальность!</span>
        {:else}
          <div id="b1" class=" flex">
            <span class="font-medium">Пользователя с таким именем нельзя создать </span>
            <div class=" ml-1 h-4 w-4 ">
              <IconQuestionMarkCircle />
            </div>
          </div>
          <Popover placement="bottom-start" class=" w-96 text-sm font-light " title="Popover title" triggeredBy="#b1">
            <div class="">
              <div class="my-1 flex space-x-3">
                {#if isValidUsernameLong}
                  <div class=" h-5 w-5 text-green-700">
                    <IconCheck />
                  </div>
                {:else}
                  <div class=" h-5 w-5 text-red-800">
                    <IconXCircle />
                  </div>
                {/if}

                <div class="">Имя пользователя содержит от 5 до 18 символов</div>
              </div>
              <div class="my-1 flex space-x-3">
                {#if isValidUsernameString}
                  <div class=" h-5 w-5 text-green-700">
                    <IconCheck />
                  </div>
                {:else}
                  <div class=" h-5 w-5 text-red-800">
                    <IconXCircle />
                  </div>
                {/if}

                <div class="">Используются только латинские буквы (a-Z) и числа</div>
              </div>
              <div class="my-1 flex space-x-3">
                {#if isUniqueUsername == null}
                  <div class=" h-5 w-5 text-sky-700">
                    <IconQuestionMarkCircle />
                  </div>
                {:else if isUniqueUsername == true}
                  <div class=" h-5 w-5 text-green-700">
                    <IconCheck />
                  </div>
                {:else if isUniqueUsername == false}
                  <div class=" h-5 w-5 text-red-800">
                    <IconXCircle />
                  </div>
                {/if}

                <div class="">Уникальное имя</div>
              </div>
            </div>
          </Popover>
        {/if}
      </Helper>
    </div>

    <div class=" mt-4" />
    {#if validationDone}
      <Toggle color="orange" bind:checked={isTitlePlayer}>Титулованный игрок (WFM,FM,WIM,IM,WGM,GM)</Toggle>
      <div class=" mt-4" />

      {#if isTitlePlayer}
        <div class="flex items-center">
          <input bind:checked={terms} type="checkbox" name="remember_me" id="remember_me" class="mr-2 rounded focus:ring-0" />
          <label for="remember_me" class="text-sm ">Подтверждаю честную игру и уважения к другим игрокам</label>
        </div>

        <div class=" mt-4" />
        <div class=" ">
          <LichessButton state={username} type="signup" />
        </div>
        <div class=" mt-4" />
        <Heading tag="h2" customSize="text-lg font-semibold" class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Преимущества регистрации через lichess</Heading>
        <List tag="ul" class="space-y-1">
          <Li>При наличии звания (WFM,WIM,WGM,FM,IM,GM) на lichess. Получаете звание у нас.</Li>
          <Li>Получаете повышенный рейтинг, чтобы сразу начать играть с соперниками по уровню.</Li>
        </List>
      {:else}
        <!-- <Heading tag="h2" customSize="text-lg font-semibold" class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Регистрация с помощью:</Heading> -->

        <div class="mb-6">
          <Label for="email" class="mb-2">Электронная почта</Label>
          <Input bind:value={email} type="email" id="email" placeholder="your@email.com" required>
            <div slot="left" class=" h-5 w-5">
              <IconEnvelop />
            </div>
          </Input>
        </div>
        <div class="mb-6">
          <Label for="password" class="mb-2">Пароль</Label>
          <Input bind:value={password} type="password" id="password" placeholder="•••••••••" required />
        </div>
        <div class="mb-6">
          <Label for="confirm_password" class="mb-2">Подтвердить пароль</Label>
          <Input bind:value={passwordConfirmed} type="password" id="confirm_password" placeholder="•••••••••" required />
        </div>

        <div class="flex items-center">
          <input bind:checked={terms} type="checkbox" name="remember_me" id="remember_me" class="mr-2 rounded focus:ring-0" />
          <label for="remember_me" class="text-sm ">Подтверждаю честную игру и уважения к другим игрокам</label>
        </div>

        <div class=" mt-4" />
        <div class=" flex justify-end ">
          <Button on:click={registration}>Зарегистрироваться</Button>
        </div>

        <div class="my-3 flex items-center justify-between">
          <div class="h-[1px] w-full bg-gray-300" />
          <span class="mx-6 text-sm uppercase text-gray-400">Или</span>
          <div class="h-[1px] w-full bg-gray-300" />
        </div>
        <div class=" grid grid-cols-2 gap-x-3 ">
          <div class=" col-span-1 h-10">
            <LichessButton state={username} type="signup" />
          </div>
          <div class=" col-span-1 h-10 ">
            <YandexButton state={username} type="signup" />
          </div>
        </div>
      {/if}
    {/if}

    <div class=" mt-4" />
  </form>

  <!-- <svelte:fragment slot="footer">
    <div class=" flex w-full justify-end space-x-2">
      <Button color="alternative">Отмена</Button>
      <Button on:click={() => alert('Handle "success"')}>Отправить вызов</Button>
    </div>
  </svelte:fragment> -->
</Modal>
