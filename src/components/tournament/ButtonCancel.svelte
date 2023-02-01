<script lang="ts">
  import { page } from '$app/stores'
  import ColorShadowButton from '$components/common/Buttons/ColorShadowButton.svelte'
  import IconPersonMinus from '$components/icons/IconPersonMinus.svelte'

  async function CancelRegister() {
    await fetch(`/api/tournament/unregister/${$page.params.id}`, {
      method: 'POST',
    })
  }
</script>

<ColorShadowButton color="red" onClick={CancelRegister} text="Отменить регистрацию">
  <div class="" slot="icon">
    <IconPersonMinus />
  </div>
</ColorShadowButton>
