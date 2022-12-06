// Функция используется в шахматных часах
export function formatTime(timestamp: number): string {
  if (timestamp <= 0) {
    return `0:00:00 `;
  }
  const minutes = Math.trunc(timestamp / 60000);
  const seconds = Math.trunc(timestamp / 1000) % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
