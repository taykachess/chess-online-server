import type { TournamentStatus } from "@prisma/client";

// {tournamentInfo.startDate.toLocaleString("ru-RU", {  month: 'long', day: 'numeric'})} {tournamentInfo.startDate.toLocaleString("ru-RU", {  timeStyle:"short"})}

export function formatDate(
  datePar: Date,
  tournamentStatus: TournamentStatus
): string {
  const now = new Date();
  const date = new Date(datePar);
  const diff = date.getTime() - now.getTime();
  if (diff < 0) {
    if (tournamentStatus == "finished") return "Турнир завершен";
    if (tournamentStatus == "running") return "Турнир идет";
  }

  const MINUTE = 60 * 1000;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  if (diff < HOUR) return `Через ${Math.round(diff / MINUTE)} минут`;
  else if (diff < DAY)
    return `Через ${Math.round(diff / HOUR)} часов ${date.toLocaleString()}`;
  else return `${date.toLocaleString()}`;
}
