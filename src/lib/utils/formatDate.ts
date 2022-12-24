import type { TournamentStatus } from "@prisma/client";

// {tournamentInfo.startDate.toLocaleString("ru-RU", {  month: 'long', day: 'numeric'})} {tournamentInfo.startDate.toLocaleString("ru-RU", {  timeStyle:"short"})}

export function formatDate(
  date: number,
  now: number,
  tournamentStatus: TournamentStatus
): string {
  const diff = date - now;

  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  if (diff < 0) {
    if (tournamentStatus == "finished") return "Турнир завершен";
    if (tournamentStatus == "running") {
      const minutes = Math.floor(-diff / MINUTE) % 60;
      const seconds = Math.floor(-diff / SECOND) % 60;
      const secondString = `${seconds < 10 ? "0" + seconds : seconds}`;

      return `Идет ${minutes}:${secondString}`;
    }
  } else if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE) % 60;
    const seconds = Math.floor(diff / SECOND) % 60;
    const secondString = `${seconds < 10 ? "0" + seconds : seconds}`;
    return `Через ${minutes}:${secondString}`;
  } else if (diff < DAY)
    return `Через ${Math.round(diff / HOUR)} часов ${date.toLocaleString()}`;

  return `${new Date(date).toLocaleString()}`;
}
