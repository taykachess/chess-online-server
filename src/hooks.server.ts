import { JWT_SECRET } from "$env/static/private";
import type { Handle } from "@sveltejs/kit";
import { verify } from "jsonwebtoken";
import type { DecodedUser } from "$lib/types/hooks/user";
export const handle: Handle = async ({ event, resolve }) => {
  console.log("Hook", event.cookies.get("token"));
  const token = event.cookies.get("token");
  if (!token) {
    return await resolve(event);
  }
  try {
    const decodedUser = verify(token, JWT_SECRET) as DecodedUser;
    event.locals.user = decodedUser;
  } catch (error) {
    event.cookies.delete("token");
  }

  const response = await resolve(event);
  return response;
};
