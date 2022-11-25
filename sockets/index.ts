/* eslint-disable @typescript-eslint/ban-ts-comment */
import { io, app } from "./global/io";
import { verify } from "jsonwebtoken";

import * as dotenv from "dotenv";
import { challengeController } from "./controllers/challengeController";
import { onDisconnect } from "./providers/base/onDisconnect";
import { gameController } from "./controllers/gameController";
import { matchController } from "./controllers/matchController";
import { tournamentController } from "./controllers/tournamentController";
dotenv.config({ path: "../.env" });

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) next();
  if (token) {
    // @ts-ignore
    verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      // console.log("decoded", decoded);
      // @ts-ignore
      socket.data.id = decoded?.id;
      // @ts-ignore
      socket.data.username = decoded?.username;
      next();
    });
  }
});

io.on("connection", async (socket) => {
  challengeController(socket);
  gameController(socket);
  matchController(socket);
  tournamentController(socket);

  socket.on("disconnect", onDisconnect);
});

app.listen(3000, (token: any) => {
  console.log("Server is connected");
  if (!token) {
    console.warn("port already in use");
  }
});
