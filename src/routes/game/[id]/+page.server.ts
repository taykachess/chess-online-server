import type { GetGame } from "$types/game";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const data = await fetch(`/api/game/${params.id}`);
  const game = (await data.json()) as GetGame;
  console.log("load game", game);
  return {
    game,
  };
};
