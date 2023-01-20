<script lang="ts">
  import type { Title } from '$types/game'
  import Badge from './Badge.svelte'
  export let title: Title

  function badgeColor(title?: Title) {
    switch (title) {
      case 'GM': {
        return { text: 'text-slate-100', bg: 'bg-red-800' }
      }
      case 'IM': {
        return { text: 'text-slate-100', bg: 'bg-green-600' }
      }
      default:
        return { text: 'text-slate-100', bg: 'bg-green-800' }
    }
  }

  let color = badgeColor(title)
</script>

<Badge {color}>{title}</Badge>
