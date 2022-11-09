import type { IconSource } from "svelte-hero-icons";
export interface PalleterLi {
  title: string;
  description: string;
  bg: string;
  svg: IconSource;
  wait?: boolean;
  onClick?: any;
  onDoubleClick?: any;
}
