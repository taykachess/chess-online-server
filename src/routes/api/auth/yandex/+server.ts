import type { RequestHandler } from "./$types";
import { YANDEX_SECRET } from "$env/static/private";
import base64 from "base-64";
import { error } from "@sveltejs/kit";
import { prisma } from "$lib/db/prisma";

export const GET: RequestHandler = async ({ url, fetch }) => {
  const code = url.searchParams.get("code");
  const username = url.searchParams.get("state");

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

  console.log("code", code);

  const yandexClient = "8e344c0640bf44988536c700491a911a";

  const data = await fetch(`https://oauth.yandex.ru/token`, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${base64.encode(
        `${yandexClient}:${YANDEX_SECRET}`
      )}`,
    },
    body: `grant_type=authorization_code&code=${code}`,
  });

  if (data.status != 200) throw error(403, "Something wrong");

  const dataJson = await data.json();

  // {
  //   "token_type": "bearer",
  //   "access_token": "AQAAAACy1C6ZAAAAfa6vDLuItEy8pg-iIpnDxIs",
  //   "expires_in": 124234123534,
  //   "refresh_token": "1:GN686QVt0mmakDd9:A4pYuW9LGk0_UnlrMIWklkAuJkUWbq27loFekJVmSYrdfzdePBy7:A-2dHOmBxiXgajnD-kYOwQ",
  //   "scope": "login:info login:email login:avatar"
  // }
  dataJson.access_token;

  const info = await fetch(`https://login.yandex.ru/info`, {
    headers: {
      Authorization: `OAuth ${dataJson.access_token}`,
    },
  });

  if (info.status != 200) throw error(404, "Info not found");

  // {
  //   id: '128504982',
  //   login: 'mvkvol',
  //   client_id: '8e344c0640bf44988536c700491a911a',
  //   default_email: 'mvkvol@yandex.ru',
  //   emails: [ 'mvkvol@yandex.ru' ],
  //   psuid: '1.AAjcTg.Xj6K1DCafDyH-sJwGdYbYg.aJLtrPTPRXI29u252LayHw'
  // }
  const infoJson = await info.json();

  console.log(infoJson);
  // const userYandexId = infoJson.id;
  // const email = infoJson.default_email;

  // console.log("info status", await info.json());
  // await data.json();

  // const info = await data.json();

  // console.log(JSON.parse(JSON.stringify(data)));
  return new Response();
};
