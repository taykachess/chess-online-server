<script lang="ts">
  import type { TournamentFormat } from '@prisma/client'
  import Badge from './Badge.svelte'
  export let format: TournamentFormat

  function badgeColor(format?: TournamentFormat) {
    switch (format) {
      case 'swiss': {
        return {
          text: 'text-slate-800 ',
          bg: 'bg-sky-100 p-px px-2',
        }
      }
      //   case "IM": {
      //     return { text: "text-slate-100", bg: "bg-green-600" };
      //   }
      default:
        return { text: 'text-slate-100', bg: 'bg-green-800' }
    }
  }

  function badgeTitle(format?: TournamentFormat) {
    switch (format) {
      case 'swiss': {
        return `Щвейцарка`
      }
      //   case "IM": {
      //     return { text: "text-slate-100", bg: "bg-green-600" };
      //   }
      default:
        return ''
    }
  }

  $: color = badgeColor(format)
  $: title = badgeTitle(format)
</script>

<Badge {color}>{title}</Badge>
