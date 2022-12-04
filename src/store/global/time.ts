import { readable } from "svelte/store";

export const time = readable(new Date(), (set) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set(new Date());

  const interval = setInterval(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    set(new Date());
  }, 1000);

  return () => clearInterval(interval);
});
