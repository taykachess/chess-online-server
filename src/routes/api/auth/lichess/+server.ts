import type { RequestHandler } from "./$types";
import { JWT_SECRET } from "$env/static/private";
import { error, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/db/prisma";
import { sign } from "jsonwebtoken";
import type { Title } from "@prisma/client";

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
  const code = url.searchParams.get("code");
  const username = url.searchParams.get("state");

  console.log("got request");
  console.log(code, username);

  if (!username) throw error(403, "Username not defined");
  const userValidation =
    (username.match(/^[a-zA-Z0-9]{5,18}$/g) || []).length == 1;

  if (!userValidation) throw error(400, "Validation wrong");

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (user) throw error(400, "User with the same username was found");

  // console.log("code", code);

  // const yandexClient = "8e344c0640bf44988536c700491a911a";

  const redirect_uri = "http://localhost:5173/api/auth/lichess";
  const code_verifier = "jGzNmyHmiVzpFL8HPebJkZ0y1e_9_8WbOrVilg4Q8YI";
  // const hash =
  //   "b593deeb62bb5eb039533e45b5bfe70d90d7123db5b88f569d2a1b558977e77b";

  // const urlHash =
  //   "YjU5M2RlZWI2MmJiNWViMDM5NTMzZTQ1YjViZmU3MGQ5MGQ3MTIzZGI1Yjg4ZjU2OWQyYTFiNTU4OTc3ZTc3Yg";
  const client_id = "svelte-chess";
  const grant_type = "authorization_code";

  // const data = await fetch(`https://lichess.org/api/token`, {
  //   method: "POST",
  //   headers: {
  //     "Content-type": "application/x-www-form-urlencoded",
  //   },
  //   body: `grant_type=${grant_type}&code=${code}&code_verifier=${code_verifier}&redirect_uri=${redirect_uri}&client_id=${client_id}`,
  // });

  const data = await fetch("https://lichess.org/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type,
      redirect_uri,
      client_id,
      code,
      code_verifier,
    }),
  });

  // console.log(data);
  const dataJson = await data.json();

  console.log(dataJson);

  if (data.status != 200) throw error(403, "Something wrong");

  const info = await fetch("https://lichess.org/api/account", {
    headers: {
      Authorization: `Bearer ${dataJson.access_token}`,
    },
  });

  const infoJson = await info.json();

  const title = (infoJson.title as string).toUpperCase() as Title;
  const lichessId = infoJson.id;

  const { email } = await (
    await fetch("https://lichess.org/api/account/email", {
      headers: {
        Authorization: `Bearer ${dataJson.access_token}`,
      },
    })
  ).json();

  const createdUser = await prisma.user.create({
    data: {
      username,
      title,
      lichess: lichessId,
      email,
    },
    select: { username: true, roles: { select: { name: true } } },
  });

  if (!createdUser) throw Error("Something wrong with user creation");

  const token = sign(createdUser, JWT_SECRET);
  cookies.set("token", token, {
    path: "/",
    httpOnly: false,
  });

  throw redirect(302, "/");
};
