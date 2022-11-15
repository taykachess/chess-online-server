import type { PageServerLoad, Actions } from "./$types";
import { loginSchema, registerSchema } from "$lib/validate/registerUser";
import { invalid } from "@sveltejs/kit";
import { compare, hash } from "bcrypt";
import { prisma } from "$lib/db/prisma";
import { sign } from "jsonwebtoken";

import { JWT_SECRET } from "$env/static/private";
import { filterSchema } from "$lib/validate/filters";

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

    const userWithEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithEmail)
      return invalid(400, {
        errors: { email: ["User with this email exists"] },
      });

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
        filters: { min: -500, max: 500 },
      },
      select: { id: true, username: true, roles: { select: { name: true } } },
    });
    const token = sign(user, JWT_SECRET);
    cookies.set("token", token);

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
        id: true,
        roles: { select: { name: true } },
      },
    });

    if (!user) {
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
      { id: user.id, username: user.username, roles: user.roles },
      JWT_SECRET
    );
    cookies.set("token", token);

    return { success: true, token };
  },
  logout: async ({ request, cookies }) => {
    cookies.delete("token");
    return { success: true };
  },
  filters: async ({ request, cookies, locals }) => {
    const formData = Object.fromEntries(await request.formData());
    const min = +formData["min"];
    const max = +formData["max"];
    const filters = { min, max };
    try {
      filterSchema.parse(filters);
    } catch (err) {
      console.log("err");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { fieldErrors: errors } = err.flatten();
      console.log(errors);
      return invalid(400, { errors });
      // return invalid(400);
    }

    await prisma.user.update({
      where: { id: locals.user.id },
      data: { filters },
    });

    console.log("Ok", max, min);
    return { success: true };
  },
};
