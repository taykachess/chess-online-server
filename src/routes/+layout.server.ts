import type { LayoutServerLoad } from "./$types";
import { io } from "socket.io-client";

export const load: LayoutServerLoad = ({ locals, cookies }) => {
  const jwt = cookies.get("token");
  // const sockets = io("http://localhost:3000", {
  //   auth: { token: jwt },
  // });
  return {
    user: locals.user,
    jwt,
    // sockets,
  };
};
