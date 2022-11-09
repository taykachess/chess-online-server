import type { LayoutServerLoad } from "./$types";
import { io } from "socket.io-client";
import { prisma } from "$lib/db/prisma";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  const jwt = cookies.get("token");
  const user = await prisma.user.findUnique({
    where: { username: locals.user.username },
    select: { rating: true },
  });
  if (!user) return {};
  // const sockets = io("http://localhost:3000", {
  //   auth: { token: jwt },
  // });
  return {
    user: { ...locals.user, rating: +user?.rating },
    jwt,
    // sockets,
  };
};
