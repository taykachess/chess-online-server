import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string({ required_error: "Name is required" })
      .min(5, { message: "Name must be at least 5 length" })
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
    // terms: z.enum(["on"], {
    //   required_error: "You must accept the terms and conditions",
    // }),
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
