<script lang="ts">
  export let title: string;
  export let color: { text: string; bg: string };
</script>

<span class="  mt-px rounded {color.bg} px-1 py-px text-xs {color.text}"
  >{title}</span
>
