<script lang="ts">
  export let color: { text: string; bg: string } = {
    text: 'text-slate-100',
    bg: 'bg-slate-800',
  }
</script>

<span class="  rounded {color.bg} px-1 text-xs {color.text}">
  <slot />
</span>
