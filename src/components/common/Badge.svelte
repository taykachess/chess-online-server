<script lang="ts">
  export let title: string;
  export let color: { bg: string; text: string };
</script>

<span
  class="inline-flex items-center rounded {color.bg} px-2 py-0.5 text-xs font-medium {color.text}"
>
  {title}
</span>
