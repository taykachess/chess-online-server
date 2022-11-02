import type { PageServerLoad, Actions } from "./$types";
import { registerSchema } from "$lib/validate/registerUser";
import { invalid } from "@sveltejs/kit";
import { compare, hash } from "bcrypt";
import { prisma } from "$lib/db/prisma";
import { verify, sign } from "jsonwebtoken";

import type { createUserDto } from "$types/dto/createUserDto";
import { JWT_SECRET } from "$env/static/private";

export const load: PageServerLoad = async ({ locals }) => {
  console.log(locals.user);
  return {};
};

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
      },
      select: { id: true, username: true, roles: { select: { name: true } } },
    });
    const token = sign(user, JWT_SECRET);
    cookies.set("token", token);

    return { success: true };
  },

  login: ({ request, cookies }) => {
    return { success: true };
  },
};
