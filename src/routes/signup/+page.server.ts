/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { PageServerLoad, Actions } from "./$types";
import { z } from "zod";
import { invalid, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/db/prisma";

const registerSchema = z
  .object({
    username: z
      .string({ required_error: "Name is required" })
      .min(1, { message: "Name is required" })
      .max(64, { message: "Name must be less than 64 characters" })
      .trim(),
    email: z
      .string({ required_error: "Email is required" })
      .min(1, { message: "Email is required" })
      .max(64, { message: "Email must be less than 64 characters" })
      .email({ message: "Email must be a valid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(32, { message: "Password must be less than 32 characters" })
      .trim(),
    passwordConfirm: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(32, { message: "Password must be less than 32 characters" })
      .trim(),
    terms: z.enum(["on"], {
      required_error: "You must accept the terms and conditions",
    }),
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password and Confirm Password must match",
        path: ["password"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Password and Confirm Password must match",
        path: ["passwordConfirm"],
      });
    }
  });

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    const { password, passwordConfirm, ...rest } = formData;

    try {
      const results = registerSchema.parse(formData);

      const email = formData["email"] as string;
      const username = formData["username"] as string;

      const userWithEmail = await prisma.user.findUnique({ where: { email } });

      if (userWithEmail)
        return invalid(400, {
          data: rest,
          errors: { email: ["User with this email exists"] },
        });

      const userWithUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (userWithUsername)
        return invalid(400, {
          data: rest,
          errors: { username: ["User exists"] },
        });

      await prisma.user.create({
        data: { email, username, hashedPassword: "234" },
      });

      console.log("User registed success");
    } catch (err) {
      // @ts-ignore
      const { fieldErrors: errors } = err.flatten();
      //  @ts-ignore
      return invalid(400, { data: rest, errors });
    }
    throw redirect(300, "/");
  },
};
