/* eslint-disable @typescript-eslint/ban-ts-comment */
import { io, app } from "./global/io";
import { verify } from "jsonwebtoken";

import * as dotenv from "dotenv";
import { challengeController } from "./controllers/challengeController";
import { onDisconnect } from "./providers/base/onDisconnect";
import { gameController } from "./controllers/gameController";
import { matchController } from "./controllers/matchController";
import { tournamentController } from "./controllers/tournamentController";
import { pubClient, subClient } from "./global/redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { startTournament } from "./services/tournament/startTournament";
import { prisma } from "./global/prisma";
import { USER_ROOM } from "./variables/redisIndex";

dotenv.config({ path: "../.env" });

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) next();
  if (token) {
    console.log(token);
    // @ts-ignore
    verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      // console.log("decoded", decoded);
      // @ts-ignore
      // socket.data.id = decoded?.id;
      console.log(decoded?.username);
      // @ts-ignore
      socket.data.username = decoded?.username;
      next();
    });
  }
});

io.on("connection", async (socket) => {
  if (socket.data.username) socket.join(USER_ROOM(socket.data.username));

  challengeController(socket);
  gameController(socket);
  matchController(socket);
  tournamentController(socket);

  socket.on("disconnect", onDisconnect);
});

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  // io.of("/").adapter.on("join-room", (room, id) => {
  //   console.log(`${id} joined ${room}`);
  // });

  // io.of("/").adapter.on("leave-room", (room, id) => {
  //   console.log(`${id} leave ${room}`);
  // });
  // io.listen(3000);
  app.listen(3000, (token: any) => {
    console.log("Server is connected");
    if (!token) {
      console.warn("port already in use");
    }
  });
});

prisma.tournament
  .update({
    where: {
      id: "clav5lj9q0000p13dg45de9ix",
    },
    data: {
      status: "registration",
      startTime: new Date(new Date().getTime() + 1000 * 60 * 0.2),
    },
  })
  .then((tournament) => {
    const diff = tournament.startTime.getTime() - new Date().getTime();

    setTimeout(async () => {
      await startTournament("clav5lj9q0000p13dg45de9ix");
    }, diff);
  });
