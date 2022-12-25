import type { TournamentStatus } from "@prisma/client";

// {tournamentInfo.startDate.toLocaleString("ru-RU", {  month: 'long', day: 'numeric'})} {tournamentInfo.startDate.toLocaleString("ru-RU", {  timeStyle:"short"})}

// const options = {
//   month: "short",
//   day: "numeric",
//   hour: "numeric",
//   minute: "numeric",
//   hour12: false,
// };
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
    if (tournamentStatus == "finished") return "Завершен";
    // + new Intl.DateTimeFormat("ru-RU", options).format(date)
    // new Date(date).toLocaleString("ru-RU", {
    //   dateStyle: "short",
    //   timeStyle: "short",
    // })
    if (tournamentStatus == "running") {
      const minutes = Math.floor(-diff / MINUTE) % 60;
      const seconds = Math.floor(-diff / SECOND) % 60;
      const secondString = `${seconds < 10 ? "0" + seconds : seconds}`;

      return `Идет ${minutes}:${secondString}`;
    }
  }
  if (tournamentStatus == "registration") if (diff < 0) return "Отменен";
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE) % 60;
    const seconds = Math.floor(diff / SECOND) % 60;
    const secondString = `${seconds < 10 ? "0" + seconds : seconds}`;
    return `Через ${minutes}:${secondString}`;
  } else if (diff < DAY) {
    const minutes = Math.floor(diff / MINUTE) % 60;
    const hours = Math.floor(diff / HOUR);
    const seconds = Math.floor(diff / SECOND) % 60;
    const secondString = `${seconds < 10 ? "0" + seconds : seconds}`;
    return `Через ${hours}:${minutes}:${secondString}`;
  }

  return `${new Date(date).toLocaleString()}`;
}
