import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { invalid } from "@sveltejs/kit";

import { loginSchema, registerSchema } from "$lib/validate/registerUser";
import { prisma } from "$lib/db/prisma";

import { JWT_SECRET } from "$env/static/private";
import { filterSchema } from "$lib/validate/filters";

import type { PageServerLoad, Actions } from "./$types";

// export const load: PageServerLoad = async ({ locals }) => {
//   return {
//     user: locals.user,
//   };
// };

export const actions: Actions = {
  register: async ({ request, cookies }) => {
    const formData = Object.fromEntries(await request.formData());
    const { passwordConfirm } = formData;
    const password = formData["password"] as string;
    const email = formData["email"] as string;
    const username = formData["username"] as string;

    console.log(username, email, password, passwordConfirm);

    try {
      registerSchema.parse(formData);
    } catch (err) {
      console.log("err");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { fieldErrors: errors } = err.flatten();
      return invalid(400, { errors });
      // return invalid(400);
    }

    const userWithUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (userWithUsername)
      return invalid(400, {
        errors: { username: ["User with this email exists"] },
      });
    const salt = 10;
    const hashedPassword = await hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
      },
      select: { username: true, roles: { select: { name: true } } },
    });
    const token = sign(user, JWT_SECRET);
    cookies.set("token", token, {
      httpOnly: false,
    });

    return { success: true, token };
  },

  login: async ({ request, cookies }) => {
    const formData = Object.fromEntries(await request.formData());
    const password = formData["password"] as string;
    const username = formData["username"] as string;

    try {
      loginSchema.parse(formData);
    } catch (err) {
      console.log("err");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { fieldErrors: errors } = err.flatten();
      return invalid(400, { errors });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        hashedPassword: true,
        username: true,
        roles: { select: { name: true } },
      },
    });

    if (!user || !user.hashedPassword) {
      return invalid(400, {
        errors: {
          username: ["User with this username and password not found"],
          password: ["User with this username and password not found"],
        },
      });
    }

    const result = await compare(password, user.hashedPassword);

    if (!result) {
      return invalid(400, {
        errors: {
          username: ["User with this username and password not found"],
          password: ["User with this username and password not found"],
        },
      });
    }

    const token = sign(
      { username: user.username, roles: user.roles },
      JWT_SECRET
    );
    cookies.set("token", token, {
      path: "/",
      httpOnly: false,
    });

    return { success: true, token };
  },
  logout: async ({ request, cookies }) => {
    cookies.delete("token", {
      path: "/",
    });

    // console.log("cookie deleted");
    return { success: true };
  },
};
