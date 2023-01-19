<script lang="ts">
  import { dev } from '$app/environment'
  import { PUBLIC_APP_DEV_URL, PUBLIC_APP_PROD_URL } from '$env/static/public'

  export let state: string | undefined = undefined
  export let type: 'login' | 'signup'

  const yandexClientID = '8e344c0640bf44988536c700491a911a'
  //   prettier-ignore
  const yandexRedirect =
    type == "login"
      ? `${dev ? PUBLIC_APP_DEV_URL : PUBLIC_APP_PROD_URL}/api/auth/yandex/login`
      : `${dev ? PUBLIC_APP_DEV_URL : PUBLIC_APP_PROD_URL}/api/auth/yandex/signup`
</script>

<a
  href="https://oauth.yandex.ru/authorize?response_type=code&client_id={yandexClientID}&redirect_uri={yandexRedirect}{state ? '&state=' + state : ''}"
  class=" flex  items-center justify-center space-x-2 bg-black p-2 text-white"
>
  <!-- prettier-ignore -->
  <div class=" flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 ">
    Я
  </div>
  <div class="">Яндекс ID</div>
</a>
