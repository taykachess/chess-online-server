export type Tab = "challenge" | "match" | "tournament" | "puzzle";
export type TournamentTab = "all" | "IRegistered" | "ICreated";
export type ChallengeTab = "game" | "match";

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
