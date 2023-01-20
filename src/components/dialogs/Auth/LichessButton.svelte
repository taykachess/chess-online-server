<script lang="ts">
  import { dev } from '$app/environment'
  import IconLichess from '$components/icons/IconLichess.svelte'
  import { PUBLIC_APP_DEV_URL, PUBLIC_APP_PROD_URL } from '$env/static/public'

  export let state: string | undefined = undefined
  export let type: 'login' | 'signup'
  const code_challenge = 'mQMOoD93XTahZHU4OtTwImi_0soQ_maBmVnIIjcCQ4Y'
  let lichessRedirect = type == 'login' ? `${dev ? PUBLIC_APP_DEV_URL : PUBLIC_APP_PROD_URL}/api/auth/lichess/login` : `${dev ? PUBLIC_APP_DEV_URL : PUBLIC_APP_PROD_URL}/api/auth/lichess/signup`
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<a
  href="https://lichess.org/oauth?response_type=code&code_challenge_method=S256&code_challenge={code_challenge}&redirect_uri={lichessRedirect}&client_id=svelte-chess&scope=email:read{state
    ? '&state=' + state
    : ''}"
  class=" relative flex cursor-pointer items-center justify-center  space-x-2 border border-black p-2 hover:bg-slate-50"
>
  <slot />
  <div class=" h-4 w-4">
    <IconLichess />
  </div>
  <div class="">lichess.org</div>
</a>
