import type { LayoutServerLoad } from "./$types";
import { prisma } from "$lib/db/prisma";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  if (!locals.user) return {};
  const user = await prisma.user.findUnique({
    where: { username: locals.user?.username },
    select: { rating: true, filters: true },
  });

  return {
    user: {
      ...locals.user,
      rating: Number(user?.rating),
      filters: user?.filters,
    },
  };
};
