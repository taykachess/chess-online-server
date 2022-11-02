import type { RequestHandler } from "./$types";
import type { createUserDto } from "$types/dto/createUserDto";
import { error, invalid } from "@sveltejs/kit";
import { registerSchema } from "$lib/validate/registerUser";

export const GET: RequestHandler = async () => {
  return new Response();
};

export const POST: RequestHandler = async ({ request }) => {
  const formData = (await request.json()) as createUserDto;
  const { username, email, password, passwordConfirm } = formData;

  console.log(username, email);

  try {
    registerSchema.parse(formData);
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { fieldErrors: errors } = err.flatten();
    throw invalid(400, { errors });
    // return invalid(400);
  }
  return new Response();
};
