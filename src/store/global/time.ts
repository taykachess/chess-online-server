import { readable } from "svelte/store";

export const time = readable(Date.now(), (set) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set(Date.now());

  const interval = setInterval(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    set(Date.now());
  }, 1000);

  return () => clearInterval(interval);
});
