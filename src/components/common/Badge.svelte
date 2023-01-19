<script lang="ts">
  export let color: { text: string; bg: string } = {
    text: 'text-slate-100',
    bg: 'bg-slate-800',
  }

  // export let color: string;

  // function calculateColor(color: string): { text: string; bg: string } {
  //   switch (color) {
  //     case "blue":
  //       return { text: "text-blue-800", bg: "bg-blue-200" };
  //     default: return { text: "text-blue-800", bg: "bg-blue-200" }
  //   }
  // }
  // $: calculatedColor = calculateColor(color)
</script>

<span class="  rounded {color.bg} px-1 text-xs {color.text}">
  <slot />
</span>
